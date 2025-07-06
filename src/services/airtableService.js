import axios from 'axios';
import {trainStationData, getStationsByLineName as getStationsFromCSV} from '../data/trainStationData';

// 環境変数またはデフォルト値を使用
const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY || 'patxWbNWEvvGNDN1W.2822f4c546599d717d36798d909b35514362ab896d57612084dcd03627b9bcfe';
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID || 'appBFYfgbWNZyP0QR';
const AIRTABLE_TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME || 'Reins';

console.log('🔧 Airtable Configuration:', {
  baseId: AIRTABLE_BASE_ID,
  tableName: AIRTABLE_TABLE_NAME,
  hasApiKey: !!AIRTABLE_API_KEY,
  keyPrefix: AIRTABLE_API_KEY ? AIRTABLE_API_KEY.substring(0, 10) + '...' : 'No API Key'
});

const airtableClient = axios.create({
  baseURL: `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`,
  headers: {
    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30秒のタイムアウト
});

// リクエストインターセプター（デバッグ用）
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

// レスポンスインターセプター（デバッグ用）
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

// 接続テスト関数（改善版）
export const validateAirtableConnection = async () => {
  try {
    console.log('🔧 Testing Airtable connection...');
    
    // まずベースの情報を取得
    const testResponse = await airtableClient.get(`/${AIRTABLE_TABLE_NAME}`, {
      params: {
        maxRecords: 1,
        view: 'Grid view'
      }
    });

    const fields = testResponse.data.records[0]?.fields || {};
    const availableFields = Object.keys(fields);
    
    // 画像フィールドの確認
    const imageFields = [];
    for (let i = 1; i <= 9; i++) {
      if (fields[`画像${i}`]) {
        imageFields.push(`画像${i}`);
      }
    }

    // 重要フィールドの確認
    const importantFields = [
      '物件タイトル', '物件名', '住所', '都道府県名', '所在地名１', 
      '賃料（万円）', '使用部分面積', '面積', '沿線名', '駅名',
      'Latitude', 'Longitude'
    ];
    
    const missingFields = importantFields.filter(field => !availableFields.includes(field));
    const presentFields = importantFields.filter(field => availableFields.includes(field));

    console.log('✅ Connection test successful:', {
      totalFields: availableFields.length,
      imageFields: imageFields.length,
      presentImportantFields: presentFields.length,
      missingImportantFields: missingFields.length
    });

    return {
      success: true,
      recordCount: testResponse.data.records.length,
      fields: availableFields,
      imageFields,
      presentFields,
      missingFields,
      sampleData: fields
    };

  } catch (error) {
    console.error('❌ Airtable connection test failed:', error);
    
    let errorMessage = 'Unknown error';
    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage = 'API key is invalid or expired';
          break;
        case 403:
          errorMessage = 'Access forbidden - check permissions';
          break;
        case 404:
          errorMessage = `Table "${AIRTABLE_TABLE_NAME}" not found in base "${AIRTABLE_BASE_ID}"`;
          break;
        case 422:
          errorMessage = 'Invalid request parameters';
          break;
        default:
          errorMessage = `HTTP ${error.response.status}: ${error.response.statusText}`;
      }
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'Network connection failed';
    } else if (error.code === 'TIMEOUT') {
      errorMessage = 'Request timeout - Airtable may be slow';
    } else {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
      details: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        code: error.code
      }
    };
  }
};

// 画像URLをパース（画像2を最初に配置）
const parseImages = (record) => {
  console.log('🖼️ Parsing images from record:', record.id);
  const images = [];

  // 画像2を最初にチェック
  const image2Field = record.fields['画像2'];
  if (image2Field && Array.isArray(image2Field) && image2Field.length > 0) {
    image2Field.forEach(attachment => {
      if (attachment && attachment.url) {
        images.push(attachment.url);
        console.log(`✅ Found image 2 (first): ${attachment.url}`);
      }
    });
  }

  // 画像1を2番目にチェック
  const image1Field = record.fields['画像1'];
  if (image1Field && Array.isArray(image1Field) && image1Field.length > 0) {
    image1Field.forEach(attachment => {
      if (attachment && attachment.url) {
        images.push(attachment.url);
        console.log(`✅ Found image 1 (second): ${attachment.url}`);
      }
    });
  }

  // 画像3〜9を順番にチェック
  for (let i = 3; i <= 9; i++) {
    const imageField = record.fields[`画像${i}`];
    if (imageField && Array.isArray(imageField) && imageField.length > 0) {
      imageField.forEach(attachment => {
        if (attachment && attachment.url) {
          images.push(attachment.url);
          console.log(`✅ Found image ${i}: ${attachment.url}`);
        }
      });
    }
  }

  console.log(`🖼️ Total images found: ${images.length}`);
  return images;
};

// 物件種別の標準化
const getPropertyType = (typeString) => {
  if (!typeString) return 'other';
  const type = typeString.toLowerCase();
  
  if (type.includes('店舗') || type.includes('飲食') || type.includes('restaurant')) {
    return 'restaurant';
  }
  if (type.includes('事務所') || type.includes('オフィス') || type.includes('office')) {
    return 'office';
  }
  if (type.includes('倉庫') || type.includes('工場') || type.includes('warehouse')) {
    return 'warehouse';
  }
  if (type.includes('居宅') || type.includes('住宅') || type.includes('マンション')) {
    return 'residential';
  }
  return 'other';
};

// 賃料の計算（万円から円に変換）
const calculateRent = (rentManYen, taxAmount = 0) => {
  if (!rentManYen) return null;
  const rentYen = parseFloat(rentManYen) * 10000; // 万円を円に変換
  const tax = parseFloat(taxAmount) || 0;
  return Math.round(rentYen + tax);
};

// 住所の結合
const buildFullAddress = (fields) => {
  const parts = [
    fields['都道府県名'],
    fields['所在地名１'],
    fields['所在地名２'],
    fields['所在地名３'],
    fields['建物名']
  ].filter(part => part && part.trim() !== '');
  
  return parts.join('');
};

// 沿線・駅情報の処理
const parseTransportInfo = (fields) => {
  const trainLines = [];
  const stations = [];
  const walkingTimes = [];

  // 最大3つの沿線をチェック
  for (let i = 1; i <= 3; i++) {
    const lineField = i === 1 ? '沿線名' : `沿線名${i}`;
    const stationField = i === 1 ? '駅名' : `駅名${i}`;
    const walkField = i === 1 ? '駅より徒歩' : `駅より徒歩${i}`;

    const line = fields[lineField];
    const station = fields[stationField];
    const walk = fields[walkField];

    if (line) {
      const normalizedLine = normalizeLineName(line);
      if (normalizedLine) {
        trainLines.push(normalizedLine);
      } else {
        trainLines.push(line);
      }
    }

    if (station) stations.push(station);
    if (walk) walkingTimes.push(parseInt(walk) || 0);
  }

  return {
    trainLines,
    nearestStation: stations[0] || '',
    walkingMinutes: walkingTimes[0] || null
  };
};

// 沿線名の正規化
const normalizeLineName = (lineName) => {
  if (!lineName) return null;

  // CSVデータから完全一致を探す
  const exactMatch = trainStationData.find(line => line.name === lineName);
  if (exactMatch) return exactMatch.name;

  // 部分一致を探す
  const partialMatch = trainStationData.find(line => 
    line.name.includes(lineName) || 
    lineName.includes(line.name.replace(/^ＪＲ|^東京メトロ|^都営地下鉄/, ''))
  );
  
  return partialMatch ? partialMatch.name : null;
};

// 数値判定関数
const isNumeric = (value) => {
  if (value === null || value === undefined || value === '') return false;
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num);
};

// 面積データを安全に取得
const getAreaValue = (fields) => {
  console.log('🏢 Parsing area from fields...');
  
  const areaFields = [
    '使用部分面積', '面積', '専有面積', '建物面積', '延床面積'
  ];

  for (const fieldName of areaFields) {
    const value = fields[fieldName];
    console.log(`🔍 Checking field "${fieldName}": ${value}`);
    
    if (value && isNumeric(value)) {
      const numValue = parseFloat(value);
      console.log(`✅ Found valid area: ${numValue}㎡ from field "${fieldName}"`);
      return numValue;
    }
  }

  console.log('⚠️ No valid area found in any field');
  return null;
};

// Airtableのデータを標準化された物件フォーマットに変換
const transformAirtableRecord = (record) => {
  const fields = record.fields;
  console.log('🔍 Processing Record ID:', record.id);

  // 基本情報の抽出
  const propertyTitle = fields['物件タイトル'] || fields['物件名'] || `物件-${record.id.slice(-4)}`;
  const fullAddress = buildFullAddress(fields);
  const transportInfo = parseTransportInfo(fields);

  // 座標情報
  const latitude = fields['Latitude'] ? parseFloat(fields['Latitude']) : null;
  const longitude = fields['Longitude'] ? parseFloat(fields['Longitude']) : null;
  const coordinates = (latitude && longitude) ? {
    lat: latitude,
    lng: longitude,
    source: 'airtable'
  } : null;

  // 賃料計算
  const rent = calculateRent(fields['賃料（万円）'], fields['うち賃料消費税']);
  const deposit = calculateRent(fields['敷金'], 0);
  const keyMoney = calculateRent(fields['礼金'], fields['うち礼金消費税']);
  const managementFee = calculateRent(fields['管理費'], fields['うち管理費消費税']);

  // 面積情報
  const area = getAreaValue(fields);
  const tsuboPrice = fields['坪単価 ※3.30578で換算'] ? parseFloat(fields['坪単価 ※3.30578で換算']) : null;

  // 建物情報
  const buildingAge = fields['築年月'] ? new Date(fields['築年月']).getFullYear() : null;
  const currentYear = new Date().getFullYear();
  const ageInYears = buildingAge ? currentYear - buildingAge : null;

  // 設備・条件
  const equipment = [
    fields['設備・条件'],
    fields['設備(フリースペース)'],
    fields['条件(フリースペース)']
  ].filter(item => item && item.trim() !== '').join(',');

  // 画像を取得
  const images = parseImages(record);

  const transformedProperty = {
    // 基本情報
    id: record.id,
    title: propertyTitle,
    type: getPropertyType(fields['物件種目']),

    // 所在地情報
    address: fullAddress,
    prefecture: fields['都道府県名'] || '',
    ward: fields['所在地名１'] || '',
    location: fields['所在地名２'] || '',
    buildingName: fields['建物名'] || '',

    // 交通情報
    ...transportInfo,

    // 座標
    coordinates,

    // 賃料情報
    rent,
    rentPerSqm: fields['㎡単価'] ? parseFloat(fields['㎡単価']) : null,
    tsuboPrice,
    deposit,
    keyMoney,
    managementFee,
    securityDeposit: calculateRent(fields['保証金'], 0),

    // 面積・構造
    area,
    structure: fields['建物構造'] || '',
    floor: fields['所在階'] || '',
    totalFloors: fields['地上階層'] || '',
    basementFloors: fields['地下階層'] || '',

    // 契約条件
    contractPeriod: fields['契約期間'] || '',
    renewalType: fields['更新区分'] || '',
    renewalFee: calculateRent(fields['更新料'], 0),

    // 建物情報
    buildYear: buildingAge,
    buildingAge: ageInYears,

    // 設備・条件
    equipment,
    features: equipment ? equipment.split(',').map(f => f.trim()) : [],

    // 駐車場
    parkingAvailable: fields['駐車場在否'] === 'あり' || fields['駐車場在否'] === '有',
    parkingFee: fields['駐車場月額'] ? parseFloat(fields['駐車場月額']) : null,

    // 入居条件
    availability: fields['現況'] || '',
    availableFrom: fields['入居時期'] || '',
    moveInDate: fields['入居年月'] || '',

    // 保険・鍵
    insuranceRequired: fields['保険加入義務'] === '要' || fields['保険加入義務'] === '必要',
    keyExchangeRequired: fields['鍵交換区分'] === '要' || fields['鍵交換区分'] === '必要',
    keyExchangeFee: fields['鍵交換代金'] ? parseFloat(fields['鍵交換代金']) : null,

    // 備考
    notes: [
      fields['備考１'],
      fields['備考２'], 
      fields['備考３'],
      fields['備考４']
    ].filter(note => note && note.trim() !== '').join('\n'),

    // 詳細情報
    details: {
      propertyNumber: fields['物件番号'] || '',
      propertyType: fields['物件種目'] || '',
      rentManYen: fields['賃料（万円）'] || 0,
      rentTax: fields['うち賃料消費税'] || 0,
      sqmPrice: fields['㎡単価'] || 0,
      tsuboPrice: fields['坪単価 ※3.30578で換算'] || 0,
      securityDeposit: fields['敷金'] || 0,
      keyMoney: fields['礼金'] || 0,
      keyMoneyTax: fields['うち礼金消費税'] || 0,
      guaranteeDeposit: fields['保証金'] || 0,
      contractPeriod: fields['契約期間'] || '',
      depreciationCode: fields['償却コード'] || '',
      depreciationMonths: fields['償却月数'] || '',
      depreciationRate: fields['償却率'] || '',
      buildingLeaseType: fields['建物賃貸借区分'] || '',
      buildingLeasePeriod: fields['建物賃貸借期間'] || '',
      buildingLeaseRenewal: fields['建物賃貸借更新'] || '',
      usageArea: getAreaValue(fields),
      buildingConstruction: fields['建物構造'] || '',
      aboveFloors: fields['地上階層'] || '',
      belowFloors: fields['地下階層'] || '',
      currentFloor: fields['所在階'] || '',
      managementFeeAmount: fields['管理費'] || 0,
      managementFeeTax: fields['うち管理費消費税'] || 0,
      commonAreaFee: fields['共益費'] || 0,
      renewalCategory: fields['更新区分'] || '',
      renewalFeeAmount: fields['更新料'] || 0,
      otherMonthlyFeeName: fields['その他月額費名称'] || '',
      otherMonthlyFeeAmount: fields['その他月額費金額'] || 0,
      parkingAvailability: fields['駐車場在否'] || '',
      parkingMonthlyFee: fields['駐車場月額'] || 0,
      currentStatus: fields['現況'] || '',
      moveInTiming: fields['入居時期'] || '',
      moveInDate: fields['入居年月'] || '',
      insuranceObligation: fields['保険加入義務'] || '',
      equipmentConditions: fields['設備・条件'] || '',
      equipmentFreeSpace: fields['設備(フリースペース)'] || '',
      conditionsFreeSpace: fields['条件(フリースペース)'] || '',
      keyExchangeCategory: fields['鍵交換区分'] || '',
      keyExchangeAmount: fields['鍵交換代金'] || 0,
      remarks1: fields['備考１'] || '',
      remarks2: fields['備考２'] || '',
      remarks3: fields['備考３'] || '',
      remarks4: fields['備考４'] || '',
      fullAddress: fields['住所'] || fullAddress
    },

    // 画像
    images,

    // メタデータ
    postedDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    featured: false,
    source: 'airtable'
  };

  console.log('✅ Transformed property:', {
    id: transformedProperty.id,
    title: transformedProperty.title,
    address: transformedProperty.address,
    coordinates: transformedProperty.coordinates,
    rent: transformedProperty.rent,
    area: transformedProperty.area,
    trainLines: transformedProperty.trainLines,
    images: transformedProperty.images.length
  });

  return transformedProperty;
};

// 全ての物件データを取得（改善版）
export const fetchAllProperties = async () => {
  try {
    console.log('🚀 Starting Airtable data fetch...');
    
    // まず接続テストを実行
    const connectionTest = await validateAirtableConnection();
    if (!connectionTest.success) {
      throw new Error(`Connection failed: ${connectionTest.error}`);
    }

    let allRecords = [];
    let offset = null;
    let pageCount = 0;
    const maxPages = 10; // 無限ループ防止

    do {
      pageCount++;
      console.log(`📄 Fetching page ${pageCount}...`);
      
      if (pageCount > maxPages) {
        console.warn('⚠️ Maximum page limit reached, stopping fetch');
        break;
      }

      const params = {
        maxRecords: 100,
        view: 'Grid view'
      };
      
      if (offset) {
        params.offset = offset;
      }

      const response = await airtableClient.get(`/${AIRTABLE_TABLE_NAME}`, {
        params
      });

      const records = response.data.records || [];
      allRecords = allRecords.concat(records);
      offset = response.data.offset;

      console.log(`📄 Page ${pageCount}: ${records.length} records fetched`);
      
      // オフセットがない場合は終了
      if (!offset) {
        break;
      }

    } while (offset && pageCount < maxPages);

    console.log(`✅ Total fetched: ${allRecords.length} records from Airtable`);

    // サンプルレコードの詳細ログ
    if (allRecords.length > 0) {
      console.log('📋 Sample record fields:', Object.keys(allRecords[0].fields || {}));
      console.log('🖼️ Image fields check:', {
        '画像1': !!allRecords[0].fields['画像1'],
        '画像2': !!allRecords[0].fields['画像2'],
        '画像3': !!allRecords[0].fields['画像3']
      });
    }

    // データを変換
    const transformedProperties = allRecords
      .map(transformAirtableRecord)
      .filter(property => {
        // 有効なデータのみを返す
        const hasValidTitle = property.title && !property.title.includes('物件-');
        const hasValidAddress = property.address && property.address.length > 0;
        return hasValidTitle && hasValidAddress;
      });

    console.log(`🎯 Valid properties: ${transformedProperties.length}/${allRecords.length}`);

    return transformedProperties;

  } catch (error) {
    console.error('❌ Error fetching properties from Airtable:', error);
    
    // 詳細なエラー情報を提供
    if (error.response) {
      console.error('Response details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    
    // エラー時は空配列を返す代わりに、エラーを再スローして上位で処理
    throw new Error(`Airtable sync failed: ${error.message}`);
  }
};

// 特定の物件を取得
export const fetchPropertyById = async (id) => {
  try {
    console.log(`🔍 Fetching property by ID: ${id}`);
    
    const response = await airtableClient.get(`/${AIRTABLE_TABLE_NAME}/${id}`);
    const transformedProperty = transformAirtableRecord(response.data);
    
    console.log('✅ Property fetched successfully:', transformedProperty);
    return transformedProperty;
    
  } catch (error) {
    console.error('❌ Error fetching property by ID:', error);
    return null;
  }
};

// 条件に基づいて物件を検索
export const searchProperties = async (filters = {}) => {
  try {
    console.log('🔍 Searching properties with filters:', filters);
    
    let filterFormula = '';
    const conditions = [];

    // フィルター条件を構築
    if (filters.propertyType) {
      conditions.push(`FIND("${filters.propertyType}",{物件種目})`);
    }
    
    if (filters.area) {
      conditions.push(`OR(FIND("${filters.area}",{所在地名１}),FIND("${filters.area}",{住所}))`);
    }
    
    if (filters.station) {
      conditions.push(`OR(FIND("${filters.station}",{駅名}),FIND("${filters.station}",{駅名２}),FIND("${filters.station}",{駅名３}))`);
    }
    
    if (filters.maxRent) {
      conditions.push(`{賃料（万円)} <=${filters.maxRent}`);
    }
    
    if (filters.minArea) {
      conditions.push(`{使用部分面積} >=${filters.minArea}`);
    }

    if (conditions.length > 0) {
      filterFormula = `AND(${conditions.join(',')})`;
    }

    const params = {
      maxRecords: 100,
      view: 'Grid view',
    };
    
    if (filterFormula) {
      params.filterByFormula = filterFormula;
    }

    const response = await airtableClient.get(`/${AIRTABLE_TABLE_NAME}`, {
      params
    });

    const transformedProperties = response.data.records
      .map(transformAirtableRecord)
      .filter(property => property.address && property.title);

    return transformedProperties;
    
  } catch (error) {
    console.error('❌ Error searching properties:', error);
    return [];
  }
};

// 統計情報を取得
export const getPropertyStats = async () => {
  try {
    console.log('📊 Calculating property statistics...');
    
    const properties = await fetchAllProperties();
    
    const stats = {
      total: properties.length,
      byType: {},
      byWard: {},
      averageRent: 0,
      averageArea: 0,
      priceRanges: {
        under10: 0,
        '10to30': 0,
        '30to50': 0,
        '50to100': 0,
        over100: 0
      },
      recentlyAdded: 0,
      withImages: 0,
      withCoordinates: 0
    };

    let totalRent = 0;
    let totalArea = 0;
    let rentCount = 0;
    let areaCount = 0;

    properties.forEach(property => {
      // Type別集計
      stats.byType[property.type] = (stats.byType[property.type] || 0) + 1;

      // Ward別集計
      if (property.ward) {
        stats.byWard[property.ward] = (stats.byWard[property.ward] || 0) + 1;
      }

      // 平均計算用
      if (property.rent) {
        totalRent += property.rent;
        rentCount++;

        // 価格帯別集計
        const rentInMan = property.rent / 10000;
        if (rentInMan < 10) stats.priceRanges.under10++;
        else if (rentInMan < 30) stats.priceRanges['10to30']++;
        else if (rentInMan < 50) stats.priceRanges['30to50']++;
        else if (rentInMan < 100) stats.priceRanges['50to100']++;
        else stats.priceRanges.over100++;
      }

      if (property.area && isNumeric(property.area)) {
        totalArea += property.area;
        areaCount++;
      }

      // その他の統計
      if (property.images && property.images.length > 0) {
        stats.withImages++;
      }
      
      if (property.coordinates) {
        stats.withCoordinates++;
      }
    });

    stats.averageRent = rentCount > 0 ? Math.round(totalRent / rentCount) : 0;
    stats.averageArea = areaCount > 0 ? Math.round(totalArea / areaCount) : 0;

    console.log('📊 Statistics calculated:', stats);
    return stats;
    
  } catch (error) {
    console.error('❌ Error getting property stats:', error);
    return null;
  }
};

// CSVデータから沿線データを取得
export const fetchTrainLines = async () => {
  try {
    console.log('🚆 Loading train lines from CSV data...');
    console.log(`✅ Loaded ${trainStationData.length} train lines from CSV`);
    return trainStationData;
  } catch (error) {
    console.error('❌ Error loading train lines from CSV:', error);
    return trainStationData;
  }
};

// 特定の沿線の駅を取得
export const fetchStationsByLine = async (lineId) => {
  try {
    console.log(`🚉 Fetching stations for line ID: ${lineId}`);
    const line = trainStationData.find(line => line.id === lineId || line.name === lineId);
    
    if (line) {
      console.log(`✅ Found ${line.stations.length} stations for line: ${line.name}`);
      return line.stations;
    } else {
      console.warn(`⚠️ Line not found: ${lineId}`);
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching stations:', error);
    return [];
  }
};

// CSVデータから駅を取得する関数
export const getStationsByLineName = (lineName) => {
  if (!lineName) return [];
  const stations = getStationsFromCSV(lineName);
  console.log(`🚉 Found ${stations.length} stations for ${lineName} from CSV data`);
  return stations;
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