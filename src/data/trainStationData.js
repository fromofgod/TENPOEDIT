// CSVから抽出した正確な沿線・駅データ
export const trainStationData = [
  {
    id: 'jr_tohoku_shinkansen',
    name: 'ＪＲ東北新幹線',
    company: 'JR東日本',
    stations: ['東京', '上野'],
    type: 'shinkansen',
    color: '#22c55e'
  },
  {
    id: 'jr_joetsu_shinkansen',
    name: 'ＪＲ上越新幹線',
    company: 'JR東日本',
    stations: ['東京', '上野'],
    type: 'shinkansen',
    color: '#22c55e'
  },
  {
    id: 'jr_hokuriku_shinkansen',
    name: 'ＪＲ北陸新幹線',
    company: 'JR東日本',
    stations: ['東京', '上野'],
    type: 'shinkansen',
    color: '#22c55e'
  },
  {
    id: 'jr_yamagata_shinkansen',
    name: 'ＪＲ山形新幹線',
    company: 'JR東日本',
    stations: ['東京', '上野'],
    type: 'shinkansen',
    color: '#22c55e'
  },
  {
    id: 'jr_akita_shinkansen',
    name: 'ＪＲ秋田新幹線',
    company: 'JR東日本',
    stations: ['東京', '上野'],
    type: 'shinkansen',
    color: '#22c55e'
  },
  {
    id: 'jr_utsunomiya_line',
    name: 'ＪＲ宇都宮線',
    company: 'JR東日本',
    stations: ['上野', '尾久', '赤羽'],
    type: 'train',
    color: '#f97316'
  },
  {
    id: 'jr_joban_line',
    name: 'ＪＲ常磐線',
    company: 'JR東日本',
    stations: ['上野', '日暮里', '三河島', '南千住', '北千住'],
    type: 'train',
    color: '#10b981'
  },
  {
    id: 'jr_sobu_honsen',
    name: 'ＪＲ総武本線',
    company: 'JR東日本',
    stations: ['東京', '新日本橋', '馬喰町', '錦糸町', '亀戸', '平井', '新小岩', '小岩'],
    type: 'train',
    color: '#facc15'
  },
  {
    id: 'jr_sobu_kaisoku',
    name: 'ＪＲ総武線快速',
    company: 'JR東日本',
    stations: ['東京', '新日本橋', '馬喰町', '錦糸町', '新小岩'],
    type: 'train',
    color: '#facc15'
  },
  {
    id: 'jr_keiyo_line',
    name: 'ＪＲ京葉線',
    company: 'JR東日本',
    stations: ['東京', '八丁堀', '越中島', '潮見', '新木場', '葛西臨海公園'],
    type: 'train',
    color: '#dc2626'
  },
  {
    id: 'jr_musashino_line',
    name: 'ＪＲ武蔵野線',
    company: 'JR東日本',
    stations: ['府中本町', '北府中', '西国分寺', '新小平', '新秋津'],
    type: 'train',
    color: '#f97316'
  },
  {
    id: 'jr_joban_kaisoku',
    name: 'ＪＲ常磐線快速',
    company: 'JR東日本',
    stations: ['上野', '日暮里', '三河島', '南千住', '北千住'],
    type: 'train',
    color: '#10b981'
  },
  {
    id: 'jr_joban_kakueki',
    name: 'ＪＲ常磐線各駅停車',
    company: 'JR東日本',
    stations: ['綾瀬', '亀有', '金町'],
    type: 'train',
    color: '#10b981'
  },
  {
    id: 'jr_takasaki_line',
    name: 'ＪＲ高崎線',
    company: 'JR東日本',
    stations: ['上野', '尾久', '赤羽'],
    type: 'train',
    color: '#f97316'
  },
  {
    id: 'jr_hachiko_line',
    name: 'ＪＲ八高線(八王子－高麗川)',
    company: 'JR東日本',
    stations: ['八王子', '北八王子', '小宮', '拝島', '東福生', '箱根ケ崎'],
    type: 'train',
    color: '#f97316'
  },
  {
    id: 'jr_shonan_shinjuku',
    name: 'ＪＲ湘南新宿ライン',
    company: 'JR東日本',
    stations: ['西大井', '大崎', '恵比寿', '渋谷', '新宿', '池袋', '赤羽'],
    type: 'train',
    color: '#f97316'
  },
  {
    id: 'jr_saikyo_line',
    name: 'ＪＲ埼京線',
    company: 'JR東日本',
    stations: ['大崎', '恵比寿', '渋谷', '新宿', '池袋', '板橋', '十条', '赤羽', '北赤羽', '浮間舟渡'],
    type: 'train',
    color: '#10b981'
  },
  {
    id: 'jr_chuo_honsen',
    name: 'ＪＲ中央本線(東京－塩尻)',
    company: 'JR東日本',
    stations: ['東京', '神田', '御茶ノ水', '水道橋', '飯田橋', '市ケ谷', '四ツ谷', '信濃町', '千駄ケ谷', '代々木', '新宿', '大久保', '東中野', '中野', '高円寺', '阿佐ケ谷', '荻窪', '西荻窪', '吉祥寺', '三鷹', '武蔵境', '東小金井', '武蔵小金井', '国分寺', '西国分寺', '国立', '立川', '日野', '豊田', '八王子', '西八王子', '高尾'],
    type: 'train',
    color: '#f97316'
  },
  {
    id: 'jr_chuo_kaisoku',
    name: 'ＪＲ中央線快速',
    company: 'JR東日本',
    stations: ['東京', '神田', '御茶ノ水', '四ツ谷', '新宿', '中野', '高円寺', '阿佐ケ谷', '荻窪', '西荻窪', '吉祥寺', '三鷹', '武蔵境', '東小金井', '武蔵小金井', '国分寺', '西国分寺', '国立', '立川', '日野', '豊田', '八王子', '西八王子', '高尾'],
    type: 'train',
    color: '#f97316'
  },
  {
    id: 'jr_chuo_sobu_kakueki',
    name: 'ＪＲ中央・総武線各駅停車',
    company: 'JR東日本',
    stations: ['小岩', '新小岩', '平井', '亀戸', '錦糸町', '両国', '浅草橋', '秋葉原', '御茶ノ水', '水道橋', '飯田橋', '市ケ谷', '四ツ谷', '信濃町', '千駄ケ谷', '代々木', '新宿', '大久保', '東中野', '中野', '高円寺', '阿佐ケ谷', '荻窪', '西荻窪', '吉祥寺', '三鷹'],
    type: 'train',
    color: '#facc15'
  },
  {
    id: 'jr_ome_line',
    name: 'ＪＲ青梅線',
    company: 'JR東日本',
    stations: ['立川', '西立川', '東中神', '中神', '昭島', '拝島', '牛浜', '福生', '羽村', '小作', '河辺', '東青梅', '青梅', '宮ノ平', '日向和田', '石神前', '二俣尾', '軍畑', '沢井', '御嶽', '川井', '古里', '鳩ノ巣', '白丸', '奥多摩'],
    type: 'train',
    color: '#10b981'
  },
  {
    id: 'jr_itsukaichi_line',
    name: 'ＪＲ五日市線',
    company: 'JR東日本',
    stations: ['拝島', '熊川', '東秋留', '秋川', '武蔵引田', '武蔵増戸', '武蔵五日市'],
    type: 'train',
    color: '#10b981'
  },
  {
    id: 'jr_yamanote_line',
    name: 'ＪＲ山手線',
    company: 'JR東日本',
    stations: ['大崎', '品川', '田町', '浜松町', '新橋', '有楽町', '東京', '神田', '秋葉原', '御徒町', '上野', '鶯谷', '日暮里', '西日暮里', '田端', '駒込', '巣鴨', '大塚', '池袋', '目白', '高田馬場', '新大久保', '新宿', '代々木', '原宿', '渋谷', '恵比寿', '目黒', '五反田'],
    type: 'train',
    color: '#9acd32'
  },
  {
    id: 'jr_keihin_tohoku_line',
    name: 'ＪＲ京浜東北線',
    company: 'JR東日本',
    stations: ['赤羽', '東十条', '王子', '上中里', '田端', '西日暮里', '日暮里', '鶯谷', '上野', '御徒町', '秋葉原', '神田', '東京', '有楽町', '新橋', '浜松町', '田町', '品川', '大井町', '大森', '蒲田'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'jr_yokosuka_line',
    name: 'ＪＲ横須賀線',
    company: 'JR東日本',
    stations: ['東京', '新橋', '品川', '西大井'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'jr_tokaido_honsen',
    name: 'ＪＲ東海道本線(東京－熱海)',
    company: 'JR東日本',
    stations: ['東京', '新橋', '品川'],
    type: 'train',
    color: '#f97316'
  },
  {
    id: 'jr_nambu_line',
    name: 'ＪＲ南武線(川崎－立川)',
    company: 'JR東日本',
    stations: ['矢野口', '稲城長沼', '南多摩', '府中本町', '分倍河原', '西府', '谷保', '矢川', '西国立', '立川'],
    type: 'train',
    color: '#facc15'
  },
  {
    id: 'jr_yokohama_line',
    name: 'ＪＲ横浜線',
    company: 'JR東日本',
    stations: ['成瀬', '町田', '相原', '八王子みなみ野', '片倉', '八王子'],
    type: 'train',
    color: '#10b981'
  },
  {
    id: 'jr_tokaido_shinkansen',
    name: 'ＪＲ東海道新幹線',
    company: 'JR東海',
    stations: ['東京', '品川'],
    type: 'shinkansen',
    color: '#0ea5e9'
  },
  {
    id: 'jr_ueno_tokyo_line',
    name: 'ＪＲ上野東京ライン',
    company: 'JR東日本',
    stations: ['上野', '東京'],
    type: 'train',
    color: '#f97316'
  },
  {
    id: 'tobu_skytree_line',
    name: '東武スカイツリーライン(浅草－東武動物公園)',
    company: '東武鉄道',
    stations: ['浅草', 'とうきょうスカイツリー', '曳舟', '東向島', '鐘ケ淵', '堀切', '牛田', '北千住', '小菅', '五反野', '梅島', '西新井', '竹ノ塚'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'tobu_skytree_oshiage',
    name: '東武スカイツリーライン(曳舟－押上)',
    company: '東武鉄道',
    stations: ['曳舟', '押上'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'tobu_kameido_line',
    name: '東武亀戸線',
    company: '東武鉄道',
    stations: ['曳舟', '小村井', '東あずま', '亀戸水神', '亀戸'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'tobu_daishi_line',
    name: '東武大師線',
    company: '東武鉄道',
    stations: ['西新井', '大師前'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'tobu_tojo_line',
    name: '東武東上線',
    company: '東武鉄道',
    stations: ['池袋', '北池袋', '下板橋', '大山', '中板橋', 'ときわ台', '上板橋', '東武練馬', '下赤塚', '成増'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'seibu_ikebukuro_line',
    name: '西武池袋線(池袋－飯能)',
    company: '西武鉄道',
    stations: ['池袋', '椎名町', '東長崎', '江古田', '桜台', '練馬', '中村橋', '富士見台', '練馬高野台', '石神井公園', '大泉学園', '保谷', 'ひばりケ丘', '東久留米', '清瀬', '秋津'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'seibu_yurakucho_line',
    name: '西武有楽町線',
    company: '西武鉄道',
    stations: ['練馬', '新桜台', '小竹向原'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'seibu_toshima_line',
    name: '西武豊島線',
    company: '西武鉄道',
    stations: ['練馬', '豊島園'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'seibu_shinjuku_line',
    name: '西武新宿線',
    company: '西武鉄道',
    stations: ['西武新宿', '高田馬場', '下落合', '中井', '新井薬師前', '沼袋', '野方', '都立家政', '鷺ノ宮', '下井草', '井荻', '上井草', '上石神井', '武蔵関', '東伏見', '西武柳沢', '田無', '花小金井', '小平', '久米川', '東村山'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'seibu_seibuen_line',
    name: '西武西武園線',
    company: '西武鉄道',
    stations: ['東村山', '西武園'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'seibu_haijima_line',
    name: '西武拝島線',
    company: '西武鉄道',
    stations: ['小平', '萩山', '小川', '東大和市', '玉川上水', '武蔵砂川', '西武立川', '拝島'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'seibu_tamako_line',
    name: '西武多摩湖線',
    company: '西武鉄道',
    stations: ['国分寺', '一橋学園', '青梅街道', '萩山', '八坂', '武蔵大和', '西武遊園地'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'seibu_kokubunji_line',
    name: '西武国分寺線',
    company: '西武鉄道',
    stations: ['国分寺', '恋ケ窪', '鷹の台', '小川', '東村山'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'seibu_yamaguchi_line',
    name: '西武山口線',
    company: '西武鉄道',
    stations: ['西武遊園地'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'seibu_tamagawa_line',
    name: '西武多摩川線',
    company: '西武鉄道',
    stations: ['武蔵境', '新小金井', '多磨', '白糸台', '競艇場前', '是政'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'keisei_honsen',
    name: '京成本線',
    company: '京成電鉄',
    stations: ['京成上野', '日暮里', '新三河島', '町屋', '千住大橋', '京成関屋', '堀切菖蒲園', 'お花茶屋', '青砥', '京成高砂', '京成小岩', '江戸川'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'keisei_oshiage_line',
    name: '京成押上線',
    company: '京成電鉄',
    stations: ['押上', '京成曳舟', '八広', '四ツ木', '京成立石', '青砥'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'keisei_kanamachi_line',
    name: '京成金町線',
    company: '京成電鉄',
    stations: ['京成高砂', '柴又', '京成金町'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'keisei_narita_skyaccess',
    name: '京成成田スカイアクセス線',
    company: '京成電鉄',
    stations: ['京成高砂'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'keio_line',
    name: '京王線',
    company: '京王電鉄',
    stations: ['新宿', '笹塚', '代田橋', '明大前', '下高井戸', '桜上水', '上北沢', '八幡山', '芦花公園', '千歳烏山', '仙川', 'つつじケ丘', '柴崎', '国領', '布田', '調布', '西調布', '飛田給', '武蔵野台', '多磨霊園', '東府中', '府中', '分倍河原', '中河原', '聖蹟桜ケ丘', '百草園', '高幡不動', '南平', '平山城址公園', '長沼', '北野', '京王八王子'],
    type: 'train',
    color: '#dc2626'
  },
  {
    id: 'keio_shinjuku_line',
    name: '京王新線',
    company: '京王電鉄',
    stations: ['新宿', '初台', '幡ケ谷', '笹塚'],
    type: 'train',
    color: '#dc2626'
  },
  {
    id: 'keio_sagamihara_line',
    name: '京王相模原線',
    company: '京王電鉄',
    stations: ['調布', '京王多摩川', '京王よみうりランド', '稲城', '京王永山', '京王多摩センター', '京王堀之内', '南大沢', '多摩境'],
    type: 'train',
    color: '#dc2626'
  },
  {
    id: 'keio_keibajo_line',
    name: '京王競馬場線',
    company: '京王電鉄',
    stations: ['東府中', '府中競馬正門前'],
    type: 'train',
    color: '#dc2626'
  },
  {
    id: 'keio_dobutsuen_line',
    name: '京王動物園線',
    company: '京王電鉄',
    stations: ['高幡不動', '多摩動物公園'],
    type: 'train',
    color: '#dc2626'
  },
  {
    id: 'keio_takao_line',
    name: '京王高尾線',
    company: '京王電鉄',
    stations: ['北野', '京王片倉', '山田', 'めじろ台', '狭間', '高尾', '高尾山口'],
    type: 'train',
    color: '#dc2626'
  },
  {
    id: 'keio_inokashira_line',
    name: '京王井の頭線',
    company: '京王電鉄',
    stations: ['渋谷', '神泉', '駒場東大前', '池ノ上', '下北沢', '新代田', '東松原', '明大前', '永福町', '西永福', '浜田山', '高井戸', '富士見ケ丘', '久我山', '三鷹台', '井の頭公園', '吉祥寺'],
    type: 'train',
    color: '#dc2626'
  },
  {
    id: 'odakyu_odawara_line',
    name: '小田急小田原線',
    company: '小田急電鉄',
    stations: ['新宿', '南新宿', '参宮橋', '代々木八幡', '代々木上原', '東北沢', '下北沢', '世田谷代田', '梅ケ丘', '豪徳寺', '経堂', '千歳船橋', '祖師ケ谷大蔵', '成城学園前', '喜多見', '狛江', '和泉多摩川', '鶴川', '玉川学園前', '町田'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'odakyu_tama_line',
    name: '小田急多摩線',
    company: '小田急電鉄',
    stations: ['小田急永山', '小田急多摩センター', '唐木田'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'tokyu_toyoko_line',
    name: '東急東横線',
    company: '東急電鉄',
    stations: ['渋谷', '代官山', '中目黒', '祐天寺', '学芸大学', '都立大学', '自由が丘', '田園調布', '多摩川'],
    type: 'train',
    color: '#dc2626'
  },
  {
    id: 'tokyu_meguro_line',
    name: '東急目黒線',
    company: '東急電鉄',
    stations: ['目黒', '不動前', '武蔵小山', '西小山', '洗足', '大岡山', '奥沢', '田園調布', '多摩川'],
    type: 'train',
    color: '#dc2626'
  },
  {
    id: 'tokyu_denentoshi_line',
    name: '東急田園都市線',
    company: '東急電鉄',
    stations: ['渋谷', '池尻大橋', '三軒茶屋', '駒沢大学', '桜新町', '用賀', '二子玉川', 'つくし野', 'すずかけ台', '南町田'],
    type: 'train',
    color: '#dc2626'
  },
  {
    id: 'tokyu_oimachi_line',
    name: '東急大井町線',
    company: '東急電鉄',
    stations: ['大井町', '下神明', '戸越公園', '中延', '荏原町', '旗の台', '北千束', '大岡山', '緑が丘', '自由が丘', '九品仏', '尾山台', '等々力', '上野毛', '二子玉川'],
    type: 'train',
    color: '#dc2626'
  },
  {
    id: 'tokyu_ikegami_line',
    name: '東急池上線',
    company: '東急電鉄',
    stations: ['五反田', '大崎広小路', '戸越銀座', '荏原中延', '旗の台', '長原', '洗足池', '石川台', '雪が谷大塚', '御嶽山', '久が原', '千鳥町', '池上', '蓮沼', '蒲田'],
    type: 'train',
    color: '#dc2626'
  },
  {
    id: 'tokyu_tamagawa_line',
    name: '東急多摩川線',
    company: '東急電鉄',
    stations: ['多摩川', '沼部', '鵜の木', '下丸子', '武蔵新田', '矢口渡', '蒲田'],
    type: 'train',
    color: '#dc2626'
  },
  {
    id: 'tokyu_setagaya_line',
    name: '東急世田谷線',
    company: '東急電鉄',
    stations: ['三軒茶屋', '西太子堂', '若林', '松陰神社前', '世田谷', '上町', '宮の坂', '山下', '松原', '下高井戸'],
    type: 'train',
    color: '#dc2626'
  },
  {
    id: 'keikyu_honsen',
    name: '京急本線',
    company: '京浜急行電鉄',
    stations: ['泉岳寺', '品川', '北品川', '新馬場', '青物横丁', '鮫洲', '立会川', '大森海岸', '平和島', '大森町', '梅屋敷', '京急蒲田', '雑色', '六郷土手'],
    type: 'train',
    color: '#dc2626'
  },
  {
    id: 'keikyu_kuko_line',
    name: '京急空港線',
    company: '京浜急行電鉄',
    stations: ['京急蒲田', '糀谷', '大鳥居', '穴守稲荷', '天空橋', '羽田空港国際線ターミナル', '羽田空港国内線ターミナル'],
    type: 'train',
    color: '#dc2626'
  },
  {
    id: 'metro_ginza_line',
    name: '東京メトロ銀座線',
    company: '東京メトロ',
    stations: ['浅草', '田原町', '稲荷町', '上野', '上野広小路', '末広町', '神田', '三越前', '日本橋', '京橋', '銀座', '新橋', '虎ノ門', '溜池山王', '赤坂見附', '青山一丁目', '外苑前', '表参道', '渋谷'],
    type: 'metro',
    color: '#ff9500'
  },
  {
    id: 'metro_marunouchi_line',
    name: '東京メトロ丸ノ内線(池袋－荻窪)',
    company: '東京メトロ',
    stations: ['池袋', '新大塚', '茗荷谷', '後楽園', '本郷三丁目', '御茶ノ水', '淡路町', '大手町', '東京', '銀座', '霞ケ関', '国会議事堂前', '赤坂見附', '四ツ谷', '四谷三丁目', '新宿御苑前', '新宿三丁目', '新宿', '西新宿', '中野坂上', '新中野', '東高円寺', '新高円寺', '南阿佐ケ谷', '荻窪'],
    type: 'metro',
    color: '#e60012'
  },
  {
    id: 'metro_marunouchi_branch',
    name: '東京メトロ丸ノ内線(中野坂上－方南町)',
    company: '東京メトロ',
    stations: ['中野坂上', '中野新橋', '中野富士見町', '方南町'],
    type: 'metro',
    color: '#e60012'
  },
  {
    id: 'metro_hibiya_line',
    name: '東京メトロ日比谷線',
    company: '東京メトロ',
    stations: ['北千住', '南千住', '三ノ輪', '入谷', '上野', '仲御徒町', '秋葉原', '小伝馬町', '人形町', '茅場町', '八丁堀', '築地', '東銀座', '銀座', '日比谷', '霞ケ関', '神谷町', '六本木', '広尾', '恵比寿', '中目黒'],
    type: 'metro',
    color: '#b5b5ac'
  },
  {
    id: 'metro_tozai_line',
    name: '東京メトロ東西線',
    company: '東京メトロ',
    stations: ['中野', '落合', '高田馬場', '早稲田', '神楽坂', '飯田橋', '九段下', '竹橋', '大手町', '日本橋', '茅場町', '門前仲町', '木場', '東陽町', '南砂町', '西葛西', '葛西'],
    type: 'metro',
    color: '#009bbf'
  },
  {
    id: 'metro_chiyoda_line_main',
    name: '東京メトロ千代田線(綾瀬－代々木上原)',
    company: '東京メトロ',
    stations: ['綾瀬', '北千住', '町屋', '西日暮里', '千駄木', '根津', '湯島', '新御茶ノ水', '大手町', '二重橋前', '日比谷', '霞ケ関', '国会議事堂前', '赤坂', '乃木坂', '表参道', '明治神宮前', '代々木公園', '代々木上原'],
    type: 'metro',
    color: '#00bb85'
  },
  {
    id: 'metro_chiyoda_line_branch',
    name: '東京メトロ千代田線(綾瀬－北綾瀬)',
    company: '東京メトロ',
    stations: ['綾瀬', '北綾瀬'],
    type: 'metro',
    color: '#00bb85'
  },
  {
    id: 'metro_yurakucho_line',
    name: '東京メトロ有楽町線',
    company: '東京メトロ',
    stations: ['地下鉄成増', '地下鉄赤塚', '平和台', '氷川台', '小竹向原', '千川', '要町', '池袋', '東池袋', '護国寺', '江戸川橋', '飯田橋', '市ケ谷', '麹町', '永田町', '桜田門', '有楽町', '銀座一丁目', '新富町', '月島', '豊洲', '辰巳', '新木場'],
    type: 'metro',
    color: '#c1a470'
  },
  {
    id: 'metro_hanzomon_line',
    name: '東京メトロ半蔵門線',
    company: '東京メトロ',
    stations: ['渋谷', '表参道', '青山一丁目', '永田町', '半蔵門', '九段下', '神保町', '大手町', '三越前', '水天宮前', '清澄白河', '住吉', '錦糸町', '押上'],
    type: 'metro',
    color: '#8f76d6'
  },
  {
    id: 'metro_namboku_line',
    name: '東京メトロ南北線',
    company: '東京メトロ',
    stations: ['目黒', '白金台', '白金高輪', '麻布十番', '六本木一丁目', '溜池山王', '永田町', '四ツ谷', '市ケ谷', '飯田橋', '後楽園', '東大前', '本駒込', '駒込', '西ケ原', '王子', '王子神谷', '志茂', '赤羽岩淵'],
    type: 'metro',
    color: '#00ac9b'
  },
  {
    id: 'metro_fukutoshin_line',
    name: '東京メトロ副都心線',
    company: '東京メトロ',
    stations: ['地下鉄成増', '地下鉄赤塚', '平和台', '氷川台', '小竹向原', '千川', '要町', '池袋', '雑司が谷', '西早稲田', '東新宿', '新宿三丁目', '北参道', '明治神宮前', '渋谷'],
    type: 'metro',
    color: '#9c5ec2'
  },
  {
    id: 'toei_asakusa_line',
    name: '都営地下鉄浅草線',
    company: '都営地下鉄',
    stations: ['西馬込', '馬込', '中延', '戸越', '五反田', '高輪台', '泉岳寺', '三田', '大門', '新橋', '東銀座', '宝町', '日本橋', '人形町', '東日本橋', '浅草橋', '蔵前', '浅草', '本所吾妻橋', '押上'],
    type: 'metro',
    color: '#ff6699'
  },
  {
    id: 'toei_mita_line',
    name: '都営地下鉄三田線',
    company: '都営地下鉄',
    stations: ['目黒', '白金台', '白金高輪', '三田', '芝公園', '御成門', '内幸町', '日比谷', '大手町', '神保町', '水道橋', '春日', '白山', '千石', '巣鴨', '西巣鴨', '新板橋', '板橋区役所前', '板橋本町', '本蓮沼', '志村坂上', '志村三丁目', '蓮根', '西台', '高島平', '新高島平', '西高島平'],
    type: 'metro',
    color: '#0079c2'
  },
  {
    id: 'toei_shinjuku_line',
    name: '都営地下鉄新宿線',
    company: '都営地下鉄',
    stations: ['新宿', '新宿三丁目', '曙橋', '市ケ谷', '九段下', '神保町', '小川町', '岩本町', '馬喰横山', '浜町', '森下', '菊川', '住吉', '西大島', '大島', '東大島', '船堀', '一之江', '瑞江', '篠崎'],
    type: 'metro',
    color: '#6cbb5a'
  },
  {
    id: 'toden_arakawa_line',
    name: '都電荒川線',
    company: '都営地下鉄',
    stations: ['三ノ輪橋', '荒川一中前', '荒川区役所前', '荒川二丁目', '荒川七丁目', '町屋駅前', '町屋二丁目', '東尾久三丁目', '熊野前', '宮ノ前', '小台', '荒川遊園地前', '荒川車庫前', '梶原', '栄町', '王子駅前', '飛鳥山', '滝野川一丁目', '西ケ原四丁目', '新庚申塚', '庚申塚', '巣鴨新田', '大塚駅前', '向原', '東池袋四丁目', '都電雑司ケ谷', '鬼子母神前', '学習院下', '面影橋', '早稲田'],
    type: 'tram',
    color: '#e85298'
  },
  {
    id: 'nippori_toneri_liner',
    name: '日暮里・舎人ライナー',
    company: '都営交通',
    stations: ['日暮里', '西日暮里', '赤土小学校前', '熊野前', '足立小台', '扇大橋', '高野', '江北', '西新井大師西', '谷在家', '舎人公園', '舎人', '見沼代親水公園'],
    type: 'liner',
    color: '#e85298'
  },
  {
    id: 'toei_oedo_line',
    name: '都営地下鉄大江戸線',
    company: '都営地下鉄',
    stations: ['新宿西口', '東新宿', '若松河田', '牛込柳町', '牛込神楽坂', '飯田橋', '春日', '本郷三丁目', '上野御徒町', '新御徒町', '蔵前', '両国', '森下', '清澄白河', '門前仲町', '月島', '勝どき', '築地市場', '汐留', '大門', '赤羽橋', '麻布十番', '六本木', '青山一丁目', '国立競技場', '代々木', '新宿', '都庁前', '西新宿五丁目', '中野坂上', '東中野', '中井', '落合南長崎', '新江古田', '練馬', '豊島園', '練馬春日町', '光が丘'],
    type: 'metro',
    color: '#e85298'
  },
  {
    id: 'hokuso_line',
    name: '北総鉄道北総線',
    company: '北総鉄道',
    stations: ['京成高砂', '新柴又'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'tokyo_monorail',
    name: '東京モノレール羽田空港線',
    company: '東京モノレール',
    stations: ['浜松町', '天王洲アイル', '大井競馬場前', '流通センター', '昭和島', '整備場', '天空橋', '羽田空港国際線ビル', '新整備場', '羽田空港第１ビル', '羽田空港第２ビル'],
    type: 'monorail',
    color: '#0ea5e9'
  },
  {
    id: 'yurikamome',
    name: 'ゆりかもめ',
    company: 'ゆりかもめ',
    stations: ['新橋', '汐留', '竹芝', '日の出', '芝浦ふ頭', 'お台場海浜公園', '台場', '船の科学館', 'テレコムセンター', '青海', '国際展示場正門', '有明', '有明テニスの森', '市場前', '新豊洲', '豊洲'],
    type: 'agv',
    color: '#0ea5e9'
  },
  {
    id: 'rinkai_line',
    name: '東京臨海高速鉄道りんかい線',
    company: '東京臨海高速鉄道',
    stations: ['新木場', '東雲', '国際展示場', '東京テレポート', '天王洲アイル', '品川シーサイド', '大井町', '大崎'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'tama_monorail',
    name: '多摩モノレール',
    company: '多摩都市モノレール',
    stations: ['上北台', '桜街道', '玉川上水', '砂川七番', '泉体育館', '立飛', '高松', '立川北', '立川南', '柴崎体育館', '甲州街道', '万願寺', '高幡不動', '程久保', '多摩動物公園', '中央大学・明星大学', '大塚・帝京大学', '松が谷', '多摩センター'],
    type: 'monorail',
    color: '#0ea5e9'
  },
  {
    id: 'saitama_kosoku',
    name: '埼玉高速鉄道',
    company: '埼玉高速鉄道',
    stations: ['赤羽岩淵'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'tsukuba_express',
    name: 'つくばエクスプレス',
    company: '首都圏新都市鉄道',
    stations: ['秋葉原', '新御徒町', '浅草', '南千住', '北千住', '青井', '六町'],
    type: 'train',
    color: '#0ea5e9'
  },
  {
    id: 'takao_tozan_cable',
    name: '高尾登山電鉄高尾登山ケーブル',
    company: '高尾登山電鉄',
    stations: ['清滝', '高尾山'],
    type: 'cable',
    color: '#22c55e'
  },
  {
    id: 'mitake_tozan_cable',
    name: '御岳登山鉄道御岳山ケーブル',
    company: '御岳登山鉄道',
    stations: ['滝本', '御岳山'],
    type: 'cable',
    color: '#22c55e'
  }
];

// 駅名から沿線を検索する関数
export const findLinesByStation = (stationName) => {
  const lines = [];
  trainStationData.forEach(line => {
    if (line.stations.includes(stationName)) {
      lines.push(line);
    }
  });
  return lines;
};

// 沿線名から駅リストを取得する関数
export const getStationsByLineName = (lineName) => {
  const line = trainStationData.find(line => line.name === lineName);
  return line ? line.stations : [];
};

// 会社別の沿線を取得する関数
export const getLinesByCompany = (company) => {
  return trainStationData.filter(line => line.company === company);
};

// 沿線を検索する関数
export const searchTrainLines = (query) => {
  if (!query) return trainStationData;
  
  return trainStationData.filter(line =>
    line.name.toLowerCase().includes(query.toLowerCase()) ||
    line.company.toLowerCase().includes(query.toLowerCase())
  );
};

// 全ての駅名を取得する関数
export const getAllStations = () => {
  const allStations = new Set();
  trainStationData.forEach(line => {
    line.stations.forEach(station => {
      allStations.add(station);
    });
  });
  return Array.from(allStations).sort((a, b) => a.localeCompare(b, 'ja'));
};

// 主要な沿線のみを取得する関数（検索で使用）
export const getMajorLines = () => {
  return trainStationData.filter(line => 
    line.type === 'train' || line.type === 'metro'
  );
};

export default trainStationData;