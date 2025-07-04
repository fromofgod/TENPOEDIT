// CSVから抽出した東京都の全市区町村データ
export const tokyoAreasFromCSV = [
  'あきる野市',
  '三宅村',
  '三鷹市',
  '世田谷区',
  '中央区',
  '中野区',
  '八丈町',
  '八王子市',
  '利島村',
  '北区',
  '千代田区',
  '台東区',
  '品川区',
  '国分寺市',
  '国立市',
  '多摩市',
  '大島町',
  '大田区',
  '奥多摩町',
  '小平市',
  '小笠原村',
  '小金井市',
  '府中市',
  '御蔵島村',
  '文京区',
  '新宿区',
  '新島村',
  '日の出町',
  '日野市',
  '昭島市',
  '杉並区',
  '東久留米市',
  '東大和市',
  '東村山市',
  '板橋区',
  '檜原村',
  '武蔵村山市',
  '武蔵野市',
  '江戸川区',
  '江東区',
  '清瀬市',
  '渋谷区',
  '港区',
  '狛江市',
  '瑞穂町',
  '町田市',
  '目黒区',
  '神津島村',
  '福生市',
  '稲城市',
  '立川市',
  '練馬区',
  '羽村市',
  '荒川区',
  '葛飾区',
  '西東京市',
  '調布市',
  '豊島区',
  '足立区',
  '青ヶ島村',
  '青梅市',
  '墨田区'
];

// 区と市を分類
export const tokyoWards = tokyoAreasFromCSV.filter(area => area.endsWith('区'));
export const tokyoCities = tokyoAreasFromCSV.filter(area => !area.endsWith('区'));

// 人気エリア（23区中心）
export const popularAreas = [
  '渋谷区',
  '新宿区',
  '港区',
  '千代田区',
  '中央区',
  '品川区',
  '世田谷区',
  '目黒区',
  '中野区',
  '杉並区'
];

// エリアタイプ別分類
export const areasByType = {
  wards: tokyoWards,
  cities: tokyoCities,
  popular: popularAreas,
  all: tokyoAreasFromCSV
};

export default tokyoAreasFromCSV;