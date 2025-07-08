import axios from 'axios';
import {trainStationData,getStationsByLineName as getStationsFromCSV} from '../data/trainStationData';

// 環境変数またはデフォルト値を使用
const AIRTABLE_API_KEY=import.meta.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID=import.meta.env.VITE_AIRTABLE_BASE_ID || 'appBFYfgbWNZyP0QR';
const AIRTABLE_TABLE_NAME=import.meta.env.VITE_AIRTABLE_TABLE_NAME || 'Reins';

// 複数のビューIDを試す
const POSSIBLE_VIEW_IDS=[
null // ビュー指定なし（デフォルトビュー使用）
];

console.log('🔧 Airtable Configuration:',{
baseId: AIRTABLE_BASE_ID,
tableName: AIRTABLE_TABLE_NAME,
possibleViews: POSSIBLE_VIEW_IDS,
hasApiKey: !!AIRTABLE_API_KEY,
keyPrefix: AIRTABLE_API_KEY ? AIRTABLE_API_KEY.substring(0,10) + '...' : 'No API Key'
});

const airtableClient=axios.create({
baseURL: `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`,
headers: {
'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
'Content-Type': 'application/json',
},
timeout: 45000,
});

// リクエストインターセプター
airtableClient.interceptors.request.use(
(config)=> {
console.log('🔗 Airtable Request:',{
url: config.url,
method: config.method,
params: config.params,
timeout: config.timeout
});
return config;
},
(error)=> {
console.error('❌ Request Error:',error);
return Promise.reject(error);
}
);

// レスポンスインターセプター
airtableClient.interceptors.response.use(
(response)=> {
console.log('✅ Airtable Response:',{
status: response.status,
recordCount: response.data.records?.length || 0,
hasOffset: !!response.data.offset,
fieldsInFirstRecord: response.data.records?.[0]?.fields ? Object.keys(response.data.records[0].fields).length : 0
});
return response;
},
(error)=> {
console.error('❌ Response Error:',{
status: error.response?.status,
statusText: error.response?.statusText,
data: error.response?.data,
message: error.message
});
return Promise.reject(error);
}
);

// 複数のビューを順次試す関数
const tryMultipleViews=async (operation)=> {
let lastError=null;

for (const viewId of POSSIBLE_VIEW_IDS) {
try {
console.log(`🔍 Trying view: ${viewId || 'Default view'}`);
const params={
maxRecords: 10 // テスト用に少数で試す
};
if (viewId) {
params.view=viewId;
}

const result=await operation(params);
if (result.data.records && result.data.records.length > 0) {
console.log(`✅ Success with view: ${viewId || 'Default view'} (${result.data.records.length} records)`);
return {
success: true,
viewId,
result
};
} else {
console.log(`⚠️ View "${viewId || 'Default view'}" returned 0 records`);
}
} catch (error) {
console.log(`❌ Failed with view "${viewId || 'Default view'}":`,error.message);
lastError=error;

// 403/401エラーの場合は即座に中断
if (error.response?.status === 403 || error.response?.status === 401) {
console.error('🚫 API key permission error - stopping view attempts');
throw new Error(`API permission denied: ${error.message}`);
}

// 422エラーの場合も権限関連の可能性が高い
if (error.response?.status === 422) {
console.error('⚠️ Request validation error - possible permission issue');
}

// 403/401エラーの場合は即座に中断
if (error.response?.status === 403 || error.response?.status === 401) {
console.error('🚫 API key permission error - stopping view attempts');
throw new Error(`API permission denied: ${error.message}`);
}

// 422エラーの場合も権限関連の可能性が高い
}
}

// すべてのビューで失敗した場合
throw new Error(`All views failed. Last error: ${lastError?.message}`);
};

// 接続テスト関数（複数ビューを試行）
export const validateAirtableConnection=async ()=> {
try {
console.log('🔧 Testing Airtable connection with multiple views...');
const connectionResult=await tryMultipleViews(async (params)=> {
return await airtableClient.get(`/${AIRTABLE_TABLE_NAME}`,{params});
});

const records=connectionResult.result.data.records || [];
const workingViewId=connectionResult.viewId;

console.log('📊 Connection test results:',{
workingView: workingViewId || 'Default view',
recordCount: records.length
});

if (records.length===0) {
return {
success: false,
error: 'All views returned 0 records. The table may be empty or have restrictive filters.',
testedViews: POSSIBLE_VIEW_IDS
};
}

// 最初のレコードの詳細分析
const firstRecord=records[0];
const fields=firstRecord?.fields || {};
const availableFields=Object.keys(fields);

console.log('🔍 DETAILED FIELD ANALYSIS:');
console.log('📋 Total fields found:',availableFields.length);
console.log('📋 All available fields:',availableFields);

// 各フィールドの値と型を表示
console.log('📊 FIELD VALUES AND TYPES:');
availableFields.forEach(fieldName=> {
const value=fields[fieldName];
const type=typeof value;
const isArray=Array.isArray(value);
const hasUrl=isArray && value.length > 0 && value[0]?.url;
console.log(` "${fieldName}":`,{
type: type,
isArray: isArray,
hasUrl: hasUrl,
value: isArray ? `Array(${value.length})` : type==='string' ? value.substring(0,50) + (value.length > 50 ? '...' : '') : value
});
});

return {
success: true,
workingViewId: workingViewId,
recordCount: records.length,
fields: availableFields,
sampleData: fields,
rawRecord: firstRecord
};
} catch (error) {
console.error('❌ All Airtable connection attempts failed:',error);
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

// 安全な値取得関数（実際のフィールド名に基づく）
const getFieldValue=(fields,exactFieldNames,fallbackPatterns=[],options={})=> {
const {debug=false}=options;

if (debug) {
console.log(`🔍 Searching for exact fields:`,exactFieldNames);
console.log(`📋 Available fields:`,Object.keys(fields));
}

// 1. 正確なフィールド名での検索（最優先）
for (const fieldName of exactFieldNames) {
if (fields[fieldName] !==undefined && fields[fieldName] !==null && fields[fieldName] !=='') {
if (debug) console.log(`✅ Exact field found: "${fieldName}"=${fields[fieldName]}`);
return fields[fieldName];
}
}

// 2. フォールバックパターンでの検索
const fieldNames=Object.keys(fields);
for (const pattern of fallbackPatterns) {
const found=fieldNames.find(fieldName=> 
fieldName.toLowerCase().includes(pattern.toLowerCase())
);
if (found && fields[found] !==undefined && fields[found] !==null && fields[found] !=='') {
if (debug) console.log(`✅ Fallback match found: "${found}" (pattern: ${pattern})=${fields[found]}`);
return fields[found];
}
}

if (debug) console.log(`❌ No match found for exact fields:`,exactFieldNames);
return null;
};

// 安全な文字列変換
const safeString=(value)=> {
if (value===null || value===undefined) return '';
return String(value).trim();
};

// 安全な数値変換
const safeNumber=(value)=> {
if (value===null || value===undefined || value==='' || value==='無し' || value==='なし') {
return null;
}
if (typeof value==='number') {
return isFinite(value) ? value : null;
}

// 文字列から数値を抽出（カンマ、全角数字も対応）
const cleanValue=String(value)
.replace(/[^\d.-]/g,'') // 数字、ピリオド、マイナス以外を除去
.replace(/[０-９]/g,(s)=> String.fromCharCode(s.charCodeAt(0) - 0xFEE0));// 全角数字を半角に

const num=parseFloat(cleanValue);
return !isNaN(num) && isFinite(num) ? num : null;
};

// 画像URLを抽出
const extractImages=(record)=> {
const images=[];
const fields=record.fields;

Object.keys(fields).forEach(fieldName=> {
const fieldValue=fields[fieldName];
if (Array.isArray(fieldValue) && fieldValue.length > 0) {
fieldValue.forEach(item=> {
if (item && typeof item==='object' && item.url) {
images.push(item.url);
}
});
}
});

return images;
};

// 物件種別の判定
const determinePropertyType=(typeString)=> {
if (!typeString) return 'restaurant';// デフォルトを飲食店に

const type=safeString(typeString).toLowerCase();
if (/店舗|飲食|restaurant|shop|カフェ|レストラン|小売|retail|商業/.test(type)) return 'restaurant';
if (/事務所|オフィス|office|業務/.test(type)) return 'office';
if (/倉庫|工場|warehouse|factory|物流/.test(type)) return 'warehouse';
if (/住宅|居住|マンション|アパート|residential|住居/.test(type)) return 'residential';
if (/サービス|service/.test(type)) return 'service';
return 'restaurant';// デフォルトを飲食店に
};

// 座標情報の抽出
const extractCoordinates=(fields)=> {
// 正確なフィールド名を優先
const latValue=getFieldValue(fields,['緯度','Latitude','lat'],['lat','latitude','緯度','GPS緯度']
);
const lngValue=getFieldValue(fields,['経度','Longitude','lng'],['lng','lon','longitude','経度','GPS経度']
);

const lat=safeNumber(latValue);
const lng=safeNumber(lngValue);

// 日本の座標範囲をチェック
if (lat && lng && lat >=24 && lat <=46 && lng >=123 && lng <=146) {
return {lat,lng,source: 'airtable'};
}
return null;
};

// 沿線情報を抽出・解析
const extractTrainLines=(fields)=> {
const trainLineField=getFieldValue(fields,['沿線','路線','交通','アクセス'],['train','line','access','沿線','路線']
);

if (!trainLineField) return [];

const lines=String(trainLineField)
.split(/[、,・]/) // 区切り文字で分割（エスケープを修正）
.map(line=> line.trim())
.filter(line=> line.length > 0)
.slice(0,3);// 最大3路線まで

return lines;
};

// 物件タイトルを生成（統一フォーマット）
const generatePropertyTitle=(fields,recordId)=> {
// 1. 既存のタイトル・物件名フィールドをチェック
const existingTitle=getFieldValue(fields,['物件名','建物名','タイトル','title','name'],['物件','建物','タイトル','title']
);
if (existingTitle && existingTitle.length > 5) {
return safeString(existingTitle);
}

// 2. 住所と駅情報から自動生成
const address=getFieldValue(fields,['住所','所在地','address','location'],['住所','所在','address']
);
const station=getFieldValue(fields,['最寄駅','駅','station','access'],['駅','station','最寄']
);
const area=safeNumber(getFieldValue(fields,['面積','専有面積','使用面積','area'],['面積','area','size']
));

// 3. タイトル生成ロジック
let generatedTitle='';

// 駅情報があれば使用
if (station) {
const stationName=station.replace(/駅$/,'');// 「駅」を除去
generatedTitle +=`${stationName}駅`;
}

// 住所から区・市情報を抽出
if (address) {
const wardMatch=address.match(/(.*?[区市町村])/);
if (wardMatch) {
if (!generatedTitle.includes(wardMatch[1])) {
generatedTitle +=generatedTitle ? ` ${wardMatch[1]}` : wardMatch[1];
}
}
}

// 面積情報があれば追加
if (area) {
generatedTitle +=` ${Math.round(area)}㎡`;
}

// 物件種別を追加
generatedTitle +=' 店舗物件';

// フォールバック
if (!generatedTitle || generatedTitle.length < 8) {
generatedTitle=`店舗物件 ${recordId.slice(-6)}`;
}

return generatedTitle;
};

// Airtableレコードの変換（完全マッピング版）
const transformRecord=(record)=> {
const fields=record.fields;

console.log(`🔄 Transforming record ${record.id}:`);
console.log('📋 Available fields:',Object.keys(fields));

//===基本情報の抽出===//
// 物件タイトル（統一フォーマット）
const title=generatePropertyTitle(fields,record.id);

// 住所（正確なフィールド名）
const address=getFieldValue(fields,['住所','所在地','address'],['住所','所在','address','location']
) || '';

// 区・市町村
const ward=getFieldValue(fields,['区','市区町村','行政区'],['区','市','行政区','ward']
) || '';

//===金額情報の抽出===//
// 賃料（万円単位で格納されている可能性を考慮）
const rentRaw=safeNumber(getFieldValue(fields,['賃料','家賃','月額','rent'],['賃料','家賃','rent','price']
));

// 賃料の単位変換（万円→円）
let rent=null;
if (rentRaw) {
if (rentRaw < 1000) {
rent=rentRaw * 10000;// 万円を円に変換
} else {
rent=rentRaw;// すでに円単位
}
}

// 敷金・保証金
const deposit=safeNumber(getFieldValue(fields,['敷金','保証金','礼金','deposit'],['敷金','保証金','deposit']
));

//===物理情報の抽出===//
// 面積
const area=safeNumber(getFieldValue(fields,['面積','専有面積','使用面積','area'],['面積','area','size','広さ']
));

// 所在階
const floor=safeString(getFieldValue(fields,['階','所在階','floor'],['階','floor','フロア']
));

// 建物構造
const structure=safeString(getFieldValue(fields,['構造','建物構造','structure'],['構造','RC','SRC','鉄筋']
));

//===アクセス情報の抽出===//
// 最寄駅
const station=safeString(getFieldValue(fields,['最寄駅','駅','station'],['駅','station','最寄','access']
));

// 徒歩時間
const walkingMinutes=safeNumber(getFieldValue(fields,['徒歩','徒歩時間','walk'],['徒歩','walk','walking','分']
));

// 沿線情報
const trainLines=extractTrainLines(fields);

//===その他の情報===//
// 物件種別
const propertyType=determinePropertyType(getFieldValue(fields,['種別','用途','type'],['種別','type','用途','category']
));

// 現況・状態
const availability=safeString(getFieldValue(fields,['現況','状態','status'],['現況','status','状態']
));

// 備考
const notes=safeString(getFieldValue(fields,['備考','メモ','notes'],['備考','memo','notes','comment']
));

//===技術情報===//
// 座標情報
const coordinates=extractCoordinates(fields);

// 画像
const images=extractImages(record);

console.log(`📊 Extracted data for ${record.id}:`,{
title: title,
address: address,
ward: ward,
rent: rent,
area: area,
station: station,
trainLines: trainLines.length,
type: propertyType,
images: images.length,
coordinates: !!coordinates
});

//===変換された物件データ===
const transformedProperty={
id: record.id,
title: title,
type: propertyType,
address: address,
ward: ward,
location: ward || address.split(' ')[0] || '',
trainLines: trainLines,
nearestStation: station.replace(/駅$/,''),// 「駅」を除去
walkingMinutes: walkingMinutes,
coordinates,
rent: rent,
deposit: deposit ? (deposit < 1000 ? deposit * 10000 : deposit) : null,
area: area,
floor: floor,
structure: structure,
availability: availability,
isAvailable: true,
images,
postedDate: new Date().toISOString(),
lastUpdated: new Date().toISOString(),
featured: Math.random() < 0.1,// 10%の確率で注目物件
source: 'airtable',
notes: notes,

// 詳細情報（PropertyDetail で使用）
details: {
// 物件ID（MY-形式）
propertyId: `MY-${record.id.slice(-8)}`,

// 面積情報
usageArea: area,

// 階数情報
currentFloor: floor,

// 建物情報
buildingConstruction: structure,

// 賃料情報（万円単位）
rentManYen: rent ? Math.round(rent / 10000 * 100) / 100 : null,

// 保証金情報
securityDeposit: deposit,
securityDepositAmount: deposit,

// 現況情報
currentStatus: availability,

// 契約情報
moveInTiming: getFieldValue(fields,['入居時期','契約可能時期'],['入居','契約']),
contractPeriod: getFieldValue(fields,['契約期間','契約年数'],['契約期間','年数']),

// 費用情報
managementFeeAmount: safeNumber(getFieldValue(fields,['管理費','共益費'],['管理費','共益費'])),

// その他費用
otherMonthlyFeeName: getFieldValue(fields,['その他費用名'],['その他']),
otherMonthlyFeeAmount: safeNumber(getFieldValue(fields,['その他費用'],['その他費用'])),

// 更新情報
renewalCategory: getFieldValue(fields,['更新区分'],['更新']),
renewalFeeAmount: safeNumber(getFieldValue(fields,['更新料'],['更新料'])),

// 保険情報
insuranceObligation: getFieldValue(fields,['保険加入義務'],['保険']),

// 原データ保持
rawFields: fields
}
};

return transformedProperty;
};

// 全物件データの取得（複数ビュー対応）
export const fetchAllProperties=async ()=> {
  if (!AIRTABLE_API_KEY) {
    console.warn('⚠️ Airtable API key not configured. Please set VITE_AIRTABLE_API_KEY in your .env file.');
    console.warn('📝 Instructions:');
    console.warn('   1. Go to https://airtable.com/create/tokens');
    console.warn('   2. Create a new API key with read permissions');
    console.warn('   3. Add it to your .env file as VITE_AIRTABLE_API_KEY=your_key_here');
    return [];
  }

try {
console.log('🚀 Fetching all properties from Airtable...');

// API設定の検証
if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
throw new Error('Missing required Airtable configuration');
}

// API設定の検証
if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
throw new Error('Missing required Airtable configuration');
}

// まず動作するビューを見つける
const connectionResult=await tryMultipleViews(async (params)=> {
return await airtableClient.get(`/${AIRTABLE_TABLE_NAME}`,{params});
});

const workingViewId=connectionResult.viewId;
console.log(`✅ Using working view: ${workingViewId || 'Default view'}`);

// 全データを取得
let allRecords=[];
let offset=null;
let pageCount=0;
const maxPages=50;

do {
pageCount++;
console.log(`📄 Fetching page ${pageCount}...`);

if (pageCount > maxPages) {
console.warn('⚠️ Reached maximum page limit');
break;
}

const params={
maxRecords: 100
};
if (workingViewId) {
params.view=workingViewId;
}
if (offset) {
params.offset=offset;
}

const response=await airtableClient.get(`/${AIRTABLE_TABLE_NAME}`,{params});
const records=response.data.records || [];
allRecords=allRecords.concat(records);
offset=response.data.offset;

console.log(`📄 Page ${pageCount}: ${records.length} records`);

if (!offset || records.length===0) break;

// レート制限対策
await new Promise(resolve=> setTimeout(resolve,200));

} while (offset && pageCount < maxPages);

console.log(`✅ Total records fetched: ${allRecords.length}`);

if (allRecords.length===0) {
console.warn('⚠️ No records found');
return [];
}

// データ変換
const properties=allRecords
.map((record,index)=> {
try {
return transformRecord(record);
} catch (error) {
console.error(`❌ Error transforming record ${index}:`,error);
return null;
}
})
.filter(property=> {
// 有効性チェック
return property && property.title && property.title.length > 5;
});

console.log(`🎯 Valid properties: ${properties.length}/${allRecords.length}`);

// データ品質レポート
const qualityReport={
total: properties.length,
withCoordinates: properties.filter(p=> p.coordinates).length,
withImages: properties.filter(p=> p.images.length > 0).length,
withRent: properties.filter(p=> p.rent).length,
withAddress: properties.filter(p=> p.address && p.address.length > 5).length,
withStation: properties.filter(p=> p.nearestStation).length,
withTrainLines: properties.filter(p=> p.trainLines.length > 0).length
};

console.log('📊 Data Quality Report:',qualityReport);

// サンプルデータの表示
if (properties.length > 0) {
console.log('🔍 Sample property:',{
title: properties[0].title,
address: properties[0].address,
ward: properties[0].ward,
rent: properties[0].rent,
area: properties[0].area,
station: properties[0].nearestStation,
trainLines: properties[0].trainLines,
images: properties[0].images.length,
coordinates: !!properties[0].coordinates
});
}

return properties;

} catch (error) {
console.error('❌ Error fetching properties:',error);

// 権限エラーの場合は詳細なメッセージを提供
if (error.message.includes('API permission denied') || 
error.response?.status === 403 || 
error.response?.status === 401) {
console.error('🚫 Airtable API Permission Error:');
console.error('   - Check if your API key has access to the base and table');
console.error('   - Verify the base ID and table name are correct');
console.error('   - Ensure the API key has read permissions');
return []; // 空配列を返してアプリケーションを継続
}

// 422エラーの場合
if (error.response?.status === 422) {
console.error('⚠️ Airtable Request Validation Error:');
console.error('   - This may be due to incorrect view IDs or table configuration');
console.error('   - Check if the table name and base ID are correct');
return []; // 空配列を返してアプリケーションを継続
}

throw new Error(`Failed to fetch properties: ${error.message}`);
}
};

// 特定の物件を取得
export const fetchPropertyById=async (id)=> {
  if (!AIRTABLE_API_KEY) {
    console.warn('⚠️ Airtable API key not configured. Please set VITE_AIRTABLE_API_KEY in your .env file.');
    return null;
  }

try {
console.log(`🔍 Fetching property by ID: ${id}`);
const response=await airtableClient.get(`/${AIRTABLE_TABLE_NAME}/${id}`);
const property=transformRecord(response.data);
console.log('✅ Property fetched:',property.title);
return property;
} catch (error) {
console.error('❌ Error fetching property by ID:',error);
return null;
}
};

// 検索機能
export const searchProperties=async (filters={})=> {
try {
console.log('🔍 Searching properties with filters:',filters);
const properties=await fetchAllProperties();

// フィルタリングはフロントエンドで実行
console.log(`🔍 Search base: ${properties.length} properties`);
return properties.filter(property=> property.isAvailable);

} catch (error) {
console.error('❌ Error searching properties:',error);
return [];
}
};

// 統計情報の取得
export const getPropertyStats=async ()=> {
try {
const properties=await fetchAllProperties();

const stats={
total: properties.length,
available: properties.filter(p=> p.isAvailable).length,
byType: {},
byWard: {},
averageRent: 0,
averageArea: 0,
withImages: properties.filter(p=> p.images.length > 0).length,
withCoordinates: properties.filter(p=> p.coordinates).length
};

// 統計計算
let totalRent=0;
let totalArea=0;
let rentCount=0;
let areaCount=0;

properties.forEach(property=> {
// 種別別統計
stats.byType[property.type]=(stats.byType[property.type] || 0) + 1;

// エリア別統計
if (property.ward) {
stats.byWard[property.ward]=(stats.byWard[property.ward] || 0) + 1;
}

// 賃料統計
if (property.rent && property.isAvailable) {
totalRent +=property.rent;
rentCount++;
}

// 面積統計
if (property.area) {
totalArea +=property.area;
areaCount++;
}
});

stats.averageRent=rentCount > 0 ? Math.round(totalRent / rentCount) : 0;
stats.averageArea=areaCount > 0 ? Math.round(totalArea / areaCount) : 0;

console.log('📊 Statistics calculated:',stats);
return stats;

} catch (error) {
console.error('❌ Error calculating stats:',error);
return null;
}
};

// その他のエクスポート
export const fetchTrainLines=async ()=> {
return trainStationData;
};

export const fetchStationsByLine=async (lineId)=> {
const line=trainStationData.find(line=> line.id===lineId || line.name===lineId);
return line ? line.stations : [];
};

export const getStationsByLineName=(lineName)=> {
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