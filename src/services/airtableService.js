import axios from 'axios';
import {trainStationData, getStationsByLineName as getStationsFromCSV} from '../data/trainStationData';

// 環境変数またはデフォルト値を使用
const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY || 'patxWbNWEvvGNDN1W.2822f4c546599d717d36798d909b35514362ab896d57612084dcd03627b9bcfe';
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID || 'appBFYfgbWNZyP0QR';
const AIRTABLE_TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME || 'Reins';

// 複数のビューIDを試す（Grid viewをデフォルトとして使用）
const POSSIBLE_VIEW_IDS = [
  'shrKoKZIuYxzEI6K4', // 提供されたビューID
  'viwGridView',        // 一般的なGrid view ID
  'Grid view',          // ビュー名での指定
  null                  // ビュー指定なし（デフォルトビュー使用）
];

console.log('🔧 Airtable Configuration:', {
  baseId: AIRTABLE_BASE_ID,
  tableName: AIRTABLE_TABLE_NAME,
  possibleViews: POSSIBLE_VIEW_IDS,
  hasApiKey: !!AIRTABLE_API_KEY,
  keyPrefix: AIRTABLE_API_KEY ? AIRTABLE_API_KEY.substring(0, 10) + '...' : 'No API Key'
});

const airtableClient = axios.create({
  baseURL: `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`,
  headers: {
    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 45000,
});

// リクエストインターセプター
airtableClient.interceptors.request.use(
  (config) => {
    console.log('🔗 Airtable Request:', {
      url: config.url,
      method: config.method,
      params: config.params,
      timeout: config.timeout
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// レスポンスインターセプター
airtableClient.interceptors.response.use(
  (response) => {
    console.log('✅ Airtable Response:', {
      status: response.status,
      recordCount: response.data.records?.length || 0,
      hasOffset: !!response.data.offset,
      fieldsInFirstRecord: response.data.records?.[0]?.fields ? Object.keys(response.data.records[0].fields).length : 0
    });
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// 複数のビューを順次試す関数
const tryMultipleViews = async (operation) => {
  let lastError = null;
  
  for (const viewId of POSSIBLE_VIEW_IDS) {
    try {
      console.log(`🔍 Trying view: ${viewId || 'Default view'}`);
      
      const params = {
        maxRecords: 10 // テスト用に少数で試す
      };
      
      if (viewId) {
        params.view = viewId;
      }
      
      const result = await operation(params);
      
      if (result.data.records && result.data.records.length > 0) {
        console.log(`✅ Success with view: ${viewId || 'Default view'} (${result.data.records.length} records)`);
        return { success: true, viewId, result };
      } else {
        console.log(`⚠️ View "${viewId || 'Default view'}" returned 0 records`);
      }
      
    } catch (error) {
      console.log(`❌ Failed with view "${viewId || 'Default view'}":`, error.message);
      lastError = error;
    }
  }
  
  // すべてのビューで失敗した場合
  throw new Error(`All views failed. Last error: ${lastError?.message}`);
};

// 接続テスト関数（複数ビューを試行）
export const validateAirtableConnection = async () => {
  try {
    console.log('🔧 Testing Airtable connection with multiple views...');
    
    const connectionResult = await tryMultipleViews(async (params) => {
      return await airtableClient.get(`/${AIRTABLE_TABLE_NAME}`, { params });
    });
    
    const records = connectionResult.result.data.records || [];
    const workingViewId = connectionResult.viewId;
    
    console.log('📊 Connection test results:', {
      workingView: workingViewId || 'Default view',
      recordCount: records.length
    });
    
    if (records.length === 0) {
      return {
        success: false,
        error: 'All views returned 0 records. The table may be empty or have restrictive filters.',
        testedViews: POSSIBLE_VIEW_IDS
      };
    }

    // 最初のレコードの詳細分析
    const firstRecord = records[0];
    const fields = firstRecord?.fields || {};
    const availableFields = Object.keys(fields);
    
    console.log('🔍 DETAILED FIELD ANALYSIS:');
    console.log('📋 Total fields found:', availableFields.length);
    console.log('📋 All available fields:', availableFields);
    
    // 各フィールドの値と型を表示
    console.log('📊 FIELD VALUES AND TYPES:');
    availableFields.forEach(fieldName => {
      const value = fields[fieldName];
      const type = typeof value;
      const isArray = Array.isArray(value);
      const hasUrl = isArray && value.length > 0 && value[0]?.url;
      
      console.log(`  ${fieldName}:`, {
        type: type,
        isArray: isArray,
        hasUrl: hasUrl,
        value: isArray ? `Array(${value.length})` : type === 'string' ? value.substring(0, 50) + (value.length > 50 ? '...' : '') : value
      });
    });

    // 画像フィールドの検出
    const imageFields = availableFields.filter(field => {
      const value = fields[field];
      return Array.isArray(value) && value.length > 0 && value[0]?.url;
    });
    
    console.log('🖼️ Image fields detected:', imageFields);

    // 重要フィールドの自動検出（より幅広いパターン）
    const fieldDetection = {
      title: availableFields.filter(f => 
        /title|name|物件|タイトル|名前|property.*name/i.test(f)
      ),
      address: availableFields.filter(f => 
        /address|住所|所在地|location|場所/i.test(f)
      ),
      rent: availableFields.filter(f => 
        /rent|賃料|家賃|price|料金|金額/i.test(f)
      ),
      area: availableFields.filter(f => 
        /area|面積|size|広さ|坪|㎡|平米/i.test(f)
      ),
      station: availableFields.filter(f => 
        /station|駅|最寄|nearest/i.test(f)
      ),
      type: availableFields.filter(f => 
        /type|種別|用途|category|カテゴリ|業種/i.test(f)
      ),
      coordinates: availableFields.filter(f => 
        /lat|lng|lon|緯度|経度|coordinate|gps/i.test(f)
      )
    };

    console.log('🎯 Field detection results:', fieldDetection);

    // データ品質チェック
    const dataQuality = {
      totalFields: availableFields.length,
      textFields: availableFields.filter(f => typeof fields[f] === 'string').length,
      numberFields: availableFields.filter(f => typeof fields[f] === 'number').length,
      arrayFields: availableFields.filter(f => Array.isArray(fields[f])).length,
      imageFields: imageFields.length,
      emptyFields: availableFields.filter(f => !fields[f] || fields[f] === '').length
    };

    console.log('📊 Data quality analysis:', dataQuality);

    return {
      success: true,
      workingViewId: workingViewId,
      recordCount: records.length,
      fields: availableFields,
      fieldDetection,
      dataQuality,
      sampleData: fields,
      imageFields,
      rawRecord: firstRecord
    };

  } catch (error) {
    console.error('❌ All Airtable connection attempts failed:', error);
    
    return {
      success: false,
      error: error.message,
      testedViews: POSSIBLE_VIEW_IDS,
      details: {
        apiKey: AIRTABLE_API_KEY ? 'Present' : 'Missing',
        baseId: AIRTABLE_BASE_ID,
        tableName: AIRTABLE_TABLE_NAME
      }
    };
  }
};

// 安全な値取得関数
const getFieldValue = (fields, patterns, options = {}) => {
  const { preferNumber = false, preferString = false } = options;
  
  // 完全一致を最初に試す
  for (const pattern of patterns) {
    if (fields[pattern] !== undefined && fields[pattern] !== null && fields[pattern] !== '') {
      return fields[pattern];
    }
  }
  
  // 正規表現での部分一致
  const fieldNames = Object.keys(fields);
  for (const pattern of patterns) {
    const regex = new RegExp(pattern, 'i');
    const found = fieldNames.find(fieldName => regex.test(fieldName));
    if (found && fields[found] !== undefined && fields[found] !== null && fields[found] !== '') {
      return fields[found];
    }
  }
  
  return null;
};

// 安全な文字列変換
const safeString = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

// 安全な数値変換
const safeNumber = (value) => {
  if (value === null || value === undefined || value === '' || value === '無し' || value === 'なし') {
    return null;
  }
  
  if (typeof value === 'number') {
    return isFinite(value) ? value : null;
  }
  
  // 文字列から数値を抽出
  const cleanValue = String(value).replace(/[^\d.-]/g, '');
  const num = parseFloat(cleanValue);
  
  return !isNaN(num) && isFinite(num) ? num : null;
};

// 画像URLを抽出
const extractImages = (record) => {
  const images = [];
  const fields = record.fields;

  Object.keys(fields).forEach(fieldName => {
    const fieldValue = fields[fieldName];
    
    if (Array.isArray(fieldValue) && fieldValue.length > 0) {
      fieldValue.forEach(item => {
        if (item && typeof item === 'object' && item.url) {
          images.push(item.url);
        }
      });
    }
  });

  return images;
};

// 物件種別の判定
const determinePropertyType = (typeString) => {
  if (!typeString) return 'other';
  const type = safeString(typeString).toLowerCase();
  
  if (/店舗|飲食|restaurant|shop|カフェ|レストラン/.test(type)) return 'restaurant';
  if (/事務所|オフィス|office/.test(type)) return 'office';
  if (/倉庫|工場|warehouse|factory/.test(type)) return 'warehouse';
  if (/住宅|居住|マンション|アパート|residential/.test(type)) return 'residential';
  if (/小売|retail|販売|store/.test(type)) return 'retail';
  if (/サービス|service/.test(type)) return 'service';
  
  return 'other';
};

// 座標情報の抽出
const extractCoordinates = (fields) => {
  const latValue = getFieldValue(fields, ['lat', 'latitude', '緯度', 'Lat', 'Latitude']);
  const lngValue = getFieldValue(fields, ['lng', 'lon', 'longitude', '経度', 'Lng', 'Longitude']);
  
  const lat = safeNumber(latValue);
  const lng = safeNumber(lngValue);
  
  // 日本の座標範囲をチェック
  if (lat && lng && lat >= 24 && lat <= 46 && lng >= 123 && lng <= 146) {
    return { lat, lng, source: 'airtable' };
  }
  
  return null;
};

// Airtableレコードの変換
const transformRecord = (record) => {
  const fields = record.fields;
  
  // 基本情報の抽出
  const title = getFieldValue(fields, [
    'title', 'name', 'property.?name', '物件名', 'タイトル', 'Title', 'Name'
  ]) || `物件-${record.id.slice(-6)}`;

  const address = getFieldValue(fields, [
    'address', 'full.?address', '住所', '所在地', 'Address', 'Location'
  ]) || '';

  const rent = safeNumber(getFieldValue(fields, [
    'rent', 'monthly.?rent', 'price', '賃料', '家賃', 'Rent', 'Price'
  ]));

  const area = safeNumber(getFieldValue(fields, [
    'area', 'floor.?area', 'size', '面積', '専有面積', 'Area', 'Size'
  ]));

  const station = safeString(getFieldValue(fields, [
    'station', 'nearest.?station', '最寄駅', '駅', 'Station'
  ]));

  const propertyType = determinePropertyType(getFieldValue(fields, [
    'type', 'category', 'property.?type', '種別', '用途', 'Type', 'Category'
  ]));

  // 座標と画像
  const coordinates = extractCoordinates(fields);
  const images = extractImages(record);

  // 変換された物件データ
  const transformedProperty = {
    id: record.id,
    title: safeString(title),
    type: propertyType,
    address: safeString(address),
    ward: safeString(getFieldValue(fields, ['ward', '区', '市区町村', 'Ward'])),
    location: safeString(getFieldValue(fields, ['location', '所在地', 'Location'])),
    trainLines: [],
    nearestStation: station,
    walkingMinutes: safeNumber(getFieldValue(fields, ['walk', 'walking', '徒歩', 'Walking'])),
    coordinates,
    rent: rent ? (rent < 1000 ? rent * 10000 : rent) : null, // 万円→円変換
    deposit: safeNumber(getFieldValue(fields, ['deposit', '敷金', 'Deposit'])),
    area,
    availability: safeString(getFieldValue(fields, ['status', '現況', 'Status'])),
    isAvailable: true,
    images,
    postedDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    featured: Math.random() < 0.15,
    source: 'airtable',
    details: {
      propertyId: `MY-${record.id.slice(-8)}`,
      rawFields: fields,
      ...fields
    }
  };

  return transformedProperty;
};

// 全物件データの取得（複数ビュー対応）
export const fetchAllProperties = async () => {
  try {
    console.log('🚀 Fetching all properties from Airtable...');
    
    // まず動作するビューを見つける
    const connectionResult = await tryMultipleViews(async (params) => {
      return await airtableClient.get(`/${AIRTABLE_TABLE_NAME}`, { params });
    });
    
    const workingViewId = connectionResult.viewId;
    console.log(`✅ Using working view: ${workingViewId || 'Default view'}`);

    // 全データを取得
    let allRecords = [];
    let offset = null;
    let pageCount = 0;
    const maxPages = 50;

    do {
      pageCount++;
      console.log(`📄 Fetching page ${pageCount}...`);
      
      if (pageCount > maxPages) {
        console.warn('⚠️ Reached maximum page limit');
        break;
      }

      const params = {
        maxRecords: 100
      };
      
      if (workingViewId) {
        params.view = workingViewId;
      }
      
      if (offset) {
        params.offset = offset;
      }

      const response = await airtableClient.get(`/${AIRTABLE_TABLE_NAME}`, { params });
      const records = response.data.records || [];
      
      allRecords = allRecords.concat(records);
      offset = response.data.offset;

      console.log(`📄 Page ${pageCount}: ${records.length} records`);
      
      if (!offset || records.length === 0) break;
      
      // レート制限対策
      await new Promise(resolve => setTimeout(resolve, 200));

    } while (offset && pageCount < maxPages);

    console.log(`✅ Total records fetched: ${allRecords.length}`);

    if (allRecords.length === 0) {
      console.warn('⚠️ No records found');
      return [];
    }

    // データ変換
    const properties = allRecords
      .map((record, index) => {
        try {
          return transformRecord(record);
        } catch (error) {
          console.error(`❌ Error transforming record ${index}:`, error);
          return null;
        }
      })
      .filter(property => {
        return property && 
               property.title && 
               property.title.length > 5 && 
               !property.title.includes('物件-rec');
      });

    console.log(`🎯 Valid properties: ${properties.length}/${allRecords.length}`);

    // データ品質レポート
    const qualityReport = {
      total: properties.length,
      withCoordinates: properties.filter(p => p.coordinates).length,
      withImages: properties.filter(p => p.images.length > 0).length,
      withRent: properties.filter(p => p.rent).length,
      withAddress: properties.filter(p => p.address && p.address.length > 10).length,
      withStation: properties.filter(p => p.nearestStation).length
    };

    console.log('📊 Data Quality Report:', qualityReport);

    if (properties.length > 0) {
      console.log('🔍 Sample property:', properties[0]);
    }

    return properties;

  } catch (error) {
    console.error('❌ Error fetching properties:', error);
    throw new Error(`Failed to fetch properties: ${error.message}`);
  }
};

// 特定の物件を取得
export const fetchPropertyById = async (id) => {
  try {
    console.log(`🔍 Fetching property by ID: ${id}`);
    
    const response = await airtableClient.get(`/${AIRTABLE_TABLE_NAME}/${id}`);
    const property = transformRecord(response.data);
    
    console.log('✅ Property fetched:', property.title);
    return property;
    
  } catch (error) {
    console.error('❌ Error fetching property by ID:', error);
    return null;
  }
};

// 検索機能
export const searchProperties = async (filters = {}) => {
  try {
    console.log('🔍 Searching properties with filters:', filters);
    
    const properties = await fetchAllProperties();
    
    // フィルタリングはフロントエンドで実行
    console.log(`🔍 Search base: ${properties.length} properties`);
    return properties.filter(property => property.isAvailable);
    
  } catch (error) {
    console.error('❌ Error searching properties:', error);
    return [];
  }
};

// 統計情報の取得
export const getPropertyStats = async () => {
  try {
    const properties = await fetchAllProperties();
    
    const stats = {
      total: properties.length,
      available: properties.filter(p => p.isAvailable).length,
      byType: {},
      byWard: {},
      averageRent: 0,
      averageArea: 0,
      withImages: properties.filter(p => p.images.length > 0).length,
      withCoordinates: properties.filter(p => p.coordinates).length
    };

    // 統計計算
    let totalRent = 0;
    let totalArea = 0;
    let rentCount = 0;
    let areaCount = 0;

    properties.forEach(property => {
      // 種別別統計
      stats.byType[property.type] = (stats.byType[property.type] || 0) + 1;

      // エリア別統計
      if (property.ward) {
        stats.byWard[property.ward] = (stats.byWard[property.ward] || 0) + 1;
      }

      // 賃料統計
      if (property.rent && property.isAvailable) {
        totalRent += property.rent;
        rentCount++;
      }

      // 面積統計
      if (property.area) {
        totalArea += property.area;
        areaCount++;
      }
    });

    stats.averageRent = rentCount > 0 ? Math.round(totalRent / rentCount) : 0;
    stats.averageArea = areaCount > 0 ? Math.round(totalArea / areaCount) : 0;

    console.log('📊 Statistics calculated:', stats);
    return stats;
    
  } catch (error) {
    console.error('❌ Error calculating stats:', error);
    return null;
  }
};

// その他のエクスポート
export const fetchTrainLines = async () => {
  return trainStationData;
};

export const fetchStationsByLine = async (lineId) => {
  const line = trainStationData.find(line => line.id === lineId || line.name === lineId);
  return line ? line.stations : [];
};

export const getStationsByLineName = (lineName) => {
  if (!lineName) return [];
  return getStationsFromCSV(lineName);
};

export default {
  fetchAllProperties,
  fetchPropertyById,
  searchProperties,
  getPropertyStats,
  validateAirtableConnection,
  fetchTrainLines,
  fetchStationsByLine,
  getStationsByLineName
};