import React,{useState,useEffect} from 'react';
import {useParams,Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import PriceDisplay from '../components/PriceDisplay';
import FavoriteButton from '../components/FavoriteButton';
import PropertyCard from '../components/PropertyCard';
import PropertyMap from '../components/PropertyMap';
import {fetchPropertyById} from '../services/airtableService';

const {FiMapPin,FiSquare,FiClock,FiPhone,FiMail,FiChevronLeft,FiChevronRight,FiShare2,FiCalendar,FiNavigation,FiHome,FiUsers,FiWifi,FiCar,FiShield,FiZap,FiDroplet,FiThermometer,FiCamera,FiMaximize2,FiInfo,FiTrendingUp,FiStar,FiEye,FiPrint,FiDownload,FiExternalLink,FiMap,FiX,FiTrain,FiBuilding,FiDollarSign,FiKey,FiCalendarCheck,FiFileText}=FiIcons;

const PropertyDetail=()=> {
const {id}=useParams();
const [property,setProperty]=useState(null);
const [loading,setLoading]=useState(true);
const [error,setError]=useState(null);
const [currentImageIndex,setCurrentImageIndex]=useState(0);
const [activeTab,setActiveTab]=useState('overview');
const [showImageModal,setShowImageModal]=useState(false);
const [showMapModal,setShowMapModal]=useState(false);
const [contactForm,setContactForm]=useState({
name: '',
email: '',
phone: '',
company: '',
message: '',
inquiryType: 'viewing'
});

useEffect(()=> {
const loadProperty=async ()=> {
try {
setLoading(true);
console.log('🔍 Loading property with ID:',id);
const propertyData=await fetchPropertyById(id);
if (propertyData) {
setProperty(propertyData);
console.log('✅ Property loaded:',propertyData);
} else {
setError('物件が見つかりませんでした');
}
} catch (err) {
console.error('❌ Error loading property:',err);
setError('物件の読み込みに失敗しました');
} finally {
setLoading(false);
}
};

if (id) {
loadProperty();
}
},[id]);

const nextImage=()=> {
if (property && property.images.length > 0) {
setCurrentImageIndex((prev)=> 
prev===property.images.length - 1 ? 0 : prev + 1
);
}
};

const prevImage=()=> {
if (property && property.images.length > 0) {
setCurrentImageIndex((prev)=> 
prev===0 ? property.images.length - 1 : prev - 1
);
}
};

const handleContactSubmit=(e)=> {
e.preventDefault();
console.log('Contact form submitted:',contactForm);
alert('お問い合わせを送信しました。担当者より2営業日以内にご連絡いたします。');
setContactForm({
name: '',
email: '',
phone: '',
company: '',
message: '',
inquiryType: 'viewing'
});
};

const handleInputChange=(e)=> {
const {name,value}=e.target;
setContactForm(prev=> ({...prev,[name]: value}));
};

const getPropertyTypeLabel=(type)=> {
const types={
restaurant: '飲食店',
retail: '小売店',
office: 'オフィス',
warehouse: '倉庫・工場',
service: 'サービス業',
residential: '住宅',
other: 'その他'
};
return types[type] || type;
};

const formatPrice=(price)=> {
if (!price) return '応談';
return `¥${new Intl.NumberFormat('ja-JP').format(price)}`;
};

// 面積の表示フォーマット関数を改善
const formatArea=(area)=> {
if (!area || area===0 || area==='無し' || area==='なし') return '';
const numArea=parseFloat(area);
if (isNaN(numArea)) return '';
// 小数点以下2桁まで表示し、不要な0を削除
return numArea % 1===0 ? numArea.toString() : numArea.toFixed(2).replace(/\.?0+$/,'');
};

// 単位を含まない数値のフォーマット（単位重複を防ぐ）
const formatNumberOnly=(value)=> {
if (!value || value==='無し' || value==='なし') return '';
const numValue=parseFloat(value);
if (isNaN(numValue)) return '';
// 数値のみを返す（単位は別途表示）
return new Intl.NumberFormat('ja-JP').format(numValue);
};

// 万円表示のフォーマット関数を追加
const formatManYen=(value)=> {
if (!value || value===0 || value==='無し' || value==='なし') return '';
const numValue=parseFloat(value);
if (isNaN(numValue)) return '';

if (numValue < 1) {
// 1万円未満は千円単位で表示
return `${Math.round(numValue * 10)}千円`;
} else if (numValue===Math.floor(numValue)) {
// 整数の場合
return `${Math.round(numValue)}万円`;
} else {
// 小数点がある場合、適切な桁数で表示
return `${numValue.toFixed(2).replace(/\.?0+$/,'')}万円`;
}
};

// 値が存在するかチェックする関数（より厳密に）
const hasValue=(value)=> {
return value !==null && 
value !==undefined && 
value !=='' && 
value !==0 && 
value !=='無し' && 
value !=='なし' && 
value !=='NULL' && 
value !=='null' && 
!isNaN(parseFloat(value));
};

// 値を表示用にフォーマットする関数（「ー」表示対応）
const formatDisplayValue=(value,unit='')=> {
if (!hasValue(value)) {
return 'ー';
}
return `${formatNumberOnly(value)}${unit}`;
};

// 物件IDを生成または取得する関数（MY-から始まる8桁）
const getPropertyId=(property)=> {
// 既存のpropertyIdがあればそれを使用
if (property.details.propertyId && property.details.propertyId.startsWith('MY-')) {
return property.details.propertyId;
}

// 既存の物件番号がMY-形式ならそれを使用
if (property.details.propertyNumber && property.details.propertyNumber.startsWith('MY-')) {
return property.details.propertyNumber;
}

// Airtable IDからMY-形式のIDを生成
if (property.id) {
// Airtable IDの最後8文字を数字に変換
const idHash = property.id.slice(-8).split('').map(char => {
const code = char.charCodeAt(0);
return (code % 10).toString();
}).join('');
return `MY-${idHash}`;
}

return 'MY-00000000';
};

// 敷金・保証金・礼金の表示フォーマット（原データのまま表示）
const formatSecurityDeposit=(property)=> {
// 複数のフィールドをチェック
const fields = [
property.details.securityDeposit,
property.details.securityDepositAmount,
property.details.securityDepositMonths,
property.details.shikikin
];

for (const field of fields) {
if (field && field !== '' && field !== '無し' && field !== 'なし') {
// 文字列として返す（万円、ヶ月などの単位も含む）
return String(field);
}
}
return 'ー';
};

const formatGuaranteeDeposit=(property)=> {
// 複数のフィールドをチェック
const fields = [
property.details.guaranteeDeposit,
property.details.guaranteeDepositAmount,
property.details.guaranteeDepositMonths,
property.details.hoshokin
];

for (const field of fields) {
if (field && field !== '' && field !== '無し' && field !== 'なし') {
// 文字列として返す（万円、ヶ月などの単位も含む）
return String(field);
}
}
return 'ー';
};

const formatKeyMoney=(property)=> {
// 複数のフィールドをチェック
const fields = [
property.details.keyMoney,
property.details.keyMoneyAmount,
property.details.keyMoneyMonths,
property.details.reikin
];

for (const field of fields) {
if (field && field !== '' && field !== '無し' && field !== 'なし') {
// 文字列として返す（万円、ヶ月などの単位も含む）
return String(field);
}
}
return 'ー';
};

// 沿線と最寄駅の情報をフォーマット
const formatTrainLineStation=(property)=> {
if (!property.trainLines || property.trainLines.length === 0) {
return 'ー';
}

const mainLine = property.trainLines[0].replace('東京メトロ','メトロ').replace('JR','');
const station = property.nearestStation ? `${property.nearestStation}駅` : '';
const walkTime = property.walkingMinutes ? ` 徒歩${property.walkingMinutes}分` : '';

return `${mainLine} ${station}${walkTime}`.trim();
};

const tabs=[
{id: 'overview',label: '物件概要',icon: FiHome}
];

if (loading) {
return (
<div className="min-h-screen bg-gray-50 py-4 sm:py-8">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="animate-pulse">
<div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
<div className="h-64 sm:h-96 bg-gray-200 rounded mb-8"></div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
<div className="lg:col-span-2">
<div className="h-64 bg-gray-200 rounded mb-4"></div>
<div className="h-32 bg-gray-200 rounded"></div>
</div>
<div className="h-96 bg-gray-200 rounded"></div>
</div>
</div>
</div>
</div>
);
}

if (error || !property) {
return (
<div className="min-h-screen bg-gray-50 py-4 sm:py-8">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="text-center">
<h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
{error || '物件が見つかりません'}
</h1>
<Link to="/search" className="text-primary-600 hover:text-primary-700 font-medium">
検索ページに戻る
</Link>
</div>
</div>
</div>
);
}

return (
<div className="min-h-screen bg-gray-50 py-4 sm:py-8">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
{/* Breadcrumb */}
<nav className="mb-6 sm:mb-8">
<ol className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 overflow-x-auto">
<li><Link to="/" className="hover:text-primary-600 whitespace-nowrap">ホーム</Link></li>
<li>/</li>
<li><Link to="/search" className="hover:text-primary-600 whitespace-nowrap">物件検索</Link></li>
<li>/</li>
{property.ward && (
<>
<li><Link to={`/search?area=${property.ward}`} className="hover:text-primary-600 whitespace-nowrap">{property.ward}</Link></li>
<li>/</li>
</>
)}
<li className="text-gray-900 truncate min-w-0">{property.title}</li>
</ol>
</nav>

{/* Property Header - シンプル化 */}
{property.rent && (
<div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
{/* Property Header Content */}
<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
<div className="flex-1 min-w-0">
<div className="flex flex-wrap items-center gap-2 mb-3">
<span className="bg-primary-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded">
{getPropertyTypeLabel(property.type)}
</span>
{property.featured && (
<span className="bg-red-500 text-white px-2 py-1 text-xs sm:text-sm font-medium rounded">
おすすめ
</span>
)}
<span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded">
Airtable連携
</span>
</div>

<h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
{property.title}
</h1>

<div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-gray-600">
<div className="flex items-center space-x-1">
<SafeIcon icon={FiMapPin} className="text-sm flex-shrink-0" />
<span className="text-xs sm:text-sm break-all">{property.address}</span>
</div>
{property.nearestStation && (
<div className="flex items-center space-x-1">
<SafeIcon icon={FiNavigation} className="text-sm flex-shrink-0" />
<span className="text-xs sm:text-sm whitespace-nowrap">
{property.nearestStation}駅
{property.walkingMinutes && ` 徒歩${property.walkingMinutes}分`}
</span>
</div>
)}
{/* 沿線情報を追加 */}
{property.trainLines && property.trainLines.length > 0 && (
<div className="flex items-center space-x-1">
<SafeIcon icon={FiTrain} className="text-sm flex-shrink-0" />
<span className="text-xs sm:text-sm whitespace-nowrap">
{property.trainLines[0].replace('東京メトロ','メトロ').replace('JR','')}
{property.trainLines.length > 1 && ` 他${property.trainLines.length-1}路線`}
</span>
</div>
)}
{/* 建物構造情報を追加 */}
{property.details.buildingConstruction && (
<div className="flex items-center space-x-1">
<SafeIcon icon={FiBuilding} className="text-sm flex-shrink-0" />
<span className="text-xs sm:text-sm whitespace-nowrap">
{property.details.buildingConstruction}
{property.details.currentFloor && ` ${property.details.currentFloor}`}
</span>
</div>
)}
<div className="flex items-center space-x-1">
<SafeIcon icon={FiCalendar} className="text-sm flex-shrink-0" />
<span className="text-xs sm:text-sm whitespace-nowrap">更新: {new Date(property.lastUpdated).toLocaleDateString('ja-JP')}</span>
</div>
</div>
</div>

{/* Action Buttons */}
<div className="flex items-center justify-center sm:justify-end space-x-3">
<FavoriteButton property={property} size="large" />
<button className="p-2 sm:p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
<SafeIcon icon={FiShare2} className="text-sm sm:text-base" />
</button>
<button className="p-2 sm:p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
<SafeIcon icon={FiPrint} className="text-sm sm:text-base" />
</button>
</div>
</div>

{/* Price Information - シンプル化（賃料と面積のみ） */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div>
<h3 className="text-sm font-medium text-gray-700 mb-1">賃料</h3>
<div className="text-xl sm:text-2xl font-bold text-primary-600">
{formatPrice(property.rent)}<span className="text-sm text-gray-500">/月</span>
</div>
</div>

{/* 使用部分面積を表示 */}
{hasValue(property.details.usageArea) && (
<div>
<h3 className="text-sm font-medium text-gray-700 mb-1">使用部分面積</h3>
<div className="text-lg font-semibold text-gray-900">
{formatArea(property.details.usageArea)}<span className="text-sm text-gray-500">㎡</span>
</div>
</div>
)}
</div>

{property.tsuboPrice && (
<div className="mt-4 pt-4 border-t border-blue-200">
<div className="text-sm text-gray-600">
坪単価: ¥{new Intl.NumberFormat('ja-JP').format(property.tsuboPrice)}/坪
</div>
</div>
)}
</div>
)}

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
{/* Main Content */}
<div className="lg:col-span-2 space-y-6 sm:space-y-8">
{/* Image Gallery */}
{property.images && property.images.length > 0 && (
<div className="bg-white rounded-lg shadow-sm overflow-hidden">
<div className="relative">
{/* メイン画像コンテナ - レスポンシブ高さ */}
<div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gray-200 overflow-hidden">
<img 
src={property.images[currentImageIndex]} 
alt={property.title}
className="w-full h-full object-contain cursor-pointer"
onClick={()=> setShowImageModal(true)}
onError={(e)=> {
// 画像読み込みエラー時のフォールバック
e.target.style.display='none';
}}
/>
</div>

{/* Image Navigation */}
{property.images.length > 1 && (
<>
<button
onClick={prevImage}
className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-70 transition-opacity"
>
<SafeIcon icon={FiChevronLeft} className="text-sm sm:text-base" />
</button>
<button
onClick={nextImage}
className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-70 transition-opacity"
>
<SafeIcon icon={FiChevronRight} className="text-sm sm:text-base" />
</button>
</>
)}

{/* Image Counter */}
<div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black bg-opacity-70 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2">
<SafeIcon icon={FiCamera} className="text-xs" />
<span>{currentImageIndex + 1} / {property.images.length}</span>
</div>

{/* Fullscreen Button */}
<button
onClick={()=> setShowImageModal(true)}
className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-black bg-opacity-70 text-white p-1.5 sm:p-2 rounded-full hover:bg-opacity-80 transition-opacity"
>
<SafeIcon icon={FiMaximize2} className="text-xs sm:text-sm" />
</button>
</div>

{/* Thumbnail Navigation */}
{property.images.length > 1 && (
<div className="p-3 sm:p-4 bg-gray-50">
<div className="flex space-x-2 overflow-x-auto">
{property.images.map((image,index)=> (
<button
key={index}
onClick={()=> setCurrentImageIndex(index)}
className={`flex-shrink-0 w-16 h-12 sm:w-20 sm:h-16 rounded-md overflow-hidden border-2 transition-all ${
index===currentImageIndex 
? 'border-primary-600 shadow-md' 
: 'border-gray-200 hover:border-gray-300'
}`}
>
<img 
src={image} 
alt={`${property.title} ${index + 1}`}
className="w-full h-full object-cover"
onError={(e)=> {
e.target.style.display='none';
}}
/>
</button>
))}
</div>
</div>
)}
</div>
)}

{/* Property Information - 表スタイルで整理 */}
<div className="bg-white rounded-lg shadow-sm overflow-hidden">
{/* Tab Navigation - 物件概要のみ */}
<div className="border-b border-gray-200">
<nav className="flex px-4 sm:px-6">
{tabs.map((tab)=> (
<button
key={tab.id}
className="py-3 sm:py-4 px-1 sm:px-2 border-b-2 border-primary-600 font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 text-primary-600"
>
<SafeIcon icon={tab.icon} className="text-xs sm:text-sm" />
<span>{tab.label}</span>
</button>
))}
</nav>
</div>

{/* 物件詳細情報テーブル */}
<div className="p-4 sm:p-6">
<div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
<div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
<h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
<SafeIcon icon={FiFileText} className="text-blue-600" />
<span>物件詳細情報</span>
</h3>
</div>
<div className="divide-y divide-gray-200">
{/* テーブル形式の物件情報 */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-0">
{/* 左列 */}
<div className="divide-y divide-gray-200">
{/* 物件ID - MY-から始まる8桁 */}
<div className="px-4 py-3 flex justify-between items-center bg-white hover:bg-gray-50">
<span className="text-sm font-medium text-gray-700">物件ID</span>
<span className="text-sm text-gray-900 font-mono">{getPropertyId(property)}</span>
</div>

{/* 沿線と最寄駅 */}
<div className="px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100">
<span className="text-sm font-medium text-gray-700">沿線と最寄駅</span>
<span className="text-sm text-gray-900 text-right">{formatTrainLineStation(property)}</span>
</div>

{/* 面積 */}
<div className="px-4 py-3 flex justify-between items-center bg-white hover:bg-gray-50">
<span className="text-sm font-medium text-gray-700">面積</span>
<span className="text-sm text-gray-900">{property.details.usageArea ? `${formatArea(property.details.usageArea)}㎡` : 'ー'}</span>
</div>

{/* 所在階 */}
<div className="px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100">
<span className="text-sm font-medium text-gray-700">所在階</span>
<span className="text-sm text-gray-900">{property.details.currentFloor || 'ー'}</span>
</div>

{/* 賃料 */}
<div className="px-4 py-3 flex justify-between items-center bg-white hover:bg-gray-50">
<span className="text-sm font-medium text-gray-700">賃料</span>
<span className="text-sm text-gray-900 font-semibold">{property.details.rentManYen ? formatManYen(property.details.rentManYen) : 'ー'}</span>
</div>

{/* 管理費 */}
<div className="px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100">
<span className="text-sm font-medium text-gray-700">管理費</span>
<span className="text-sm text-gray-900">{property.details.managementFeeAmount ? formatManYen(property.details.managementFeeAmount) : 'ー'}</span>
</div>

{/* 共益費 */}
<div className="px-4 py-3 flex justify-between items-center bg-white hover:bg-gray-50">
<span className="text-sm font-medium text-gray-700">共益費</span>
<span className="text-sm text-gray-900">{property.details.commonAreaFee ? formatManYen(property.details.commonAreaFee) : 'ー'}</span>
</div>

{/* 敷金 - Airtableデータのまま表示 */}
<div className="px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100">
<span className="text-sm font-medium text-gray-700">敷金</span>
<span className="text-sm text-gray-900">{formatSecurityDeposit(property)}</span>
</div>

{/* 保証金 - Airtableデータのまま表示 */}
<div className="px-4 py-3 flex justify-between items-center bg-white hover:bg-gray-50">
<span className="text-sm font-medium text-gray-700">保証金</span>
<span className="text-sm text-gray-900">{formatGuaranteeDeposit(property)}</span>
</div>

{/* 礼金 - Airtableデータのまま表示 */}
<div className="px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100">
<span className="text-sm font-medium text-gray-700">礼金</span>
<span className="text-sm text-gray-900">{formatKeyMoney(property)}</span>
</div>
</div>

{/* 右列 */}
<div className="divide-y divide-gray-200 border-l border-gray-200">
{/* 償却 */}
<div className="px-4 py-3 flex justify-between items-center bg-white hover:bg-gray-50">
<span className="text-sm font-medium text-gray-700">償却</span>
<span className="text-sm text-gray-900">{property.details.depreciationCode || 'ー'}</span>
</div>

{/* 契約形態 */}
<div className="px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100">
<span className="text-sm font-medium text-gray-700">契約形態</span>
<span className="text-sm text-gray-900">{property.details.buildingLeaseType || 'ー'}</span>
</div>

{/* 契約年数 */}
<div className="px-4 py-3 flex justify-between items-center bg-white hover:bg-gray-50">
<span className="text-sm font-medium text-gray-700">契約年数</span>
<span className="text-sm text-gray-900">{property.details.contractPeriod || 'ー'}</span>
</div>

{/* 更新区分 */}
<div className="px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100">
<span className="text-sm font-medium text-gray-700">更新区分</span>
<span className="text-sm text-gray-900">{property.details.renewalCategory || 'ー'}</span>
</div>

{/* 更新料 */}
<div className="px-4 py-3 flex justify-between items-center bg-white hover:bg-gray-50">
<span className="text-sm font-medium text-gray-700">更新料</span>
<span className="text-sm text-gray-900">{property.details.renewalFeeAmount ? formatManYen(property.details.renewalFeeAmount) : 'ー'}</span>
</div>

{/* その他月額費用 */}
<div className="px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100">
<span className="text-sm font-medium text-gray-700">その他月額費用</span>
<span className="text-sm text-gray-900">
{property.details.otherMonthlyFeeName && property.details.otherMonthlyFeeAmount 
? `${property.details.otherMonthlyFeeName}: ${formatManYen(property.details.otherMonthlyFeeAmount)}`
: 'ー'}
</span>
</div>

{/* 現況 */}
<div className="px-4 py-3 flex justify-between items-center bg-white hover:bg-gray-50">
<span className="text-sm font-medium text-gray-700">現況</span>
<span className="text-sm text-gray-900">{property.details.currentStatus || 'ー'}</span>
</div>

{/* 入居時期 */}
<div className="px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100">
<span className="text-sm font-medium text-gray-700">入居時期</span>
<span className="text-sm text-gray-900">{property.details.moveInTiming || 'ー'}</span>
</div>

{/* 保険加入義務 */}
<div className="px-4 py-3 flex justify-between items-center bg-white hover:bg-gray-50">
<span className="text-sm font-medium text-gray-700">保険加入義務</span>
<span className="text-sm text-gray-900">{property.details.insuranceObligation || 'ー'}</span>
</div>

{/* 備考 */}
<div className="px-4 py-3 bg-gray-50 hover:bg-gray-100">
<div className="flex flex-col space-y-1">
<span className="text-sm font-medium text-gray-700">備考</span>
<div className="text-sm text-gray-900">
{property.notes ? (
<div className="whitespace-pre-wrap bg-white p-3 rounded border border-gray-200">
{property.notes}
</div>
) : (
<span>ー</span>
)}
</div>
</div>
</div>
</div>
</div>
</div>
</div>

{/* 所在地マップ - 完璧なのでそのまま保持 */}
{property.coordinates && (
<div className="mt-8">
<div className="flex items-center justify-between mb-4">
<h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center space-x-2">
<SafeIcon icon={FiMap} className="text-green-600" />
<span>所在地マップ</span>
</h3>
<button
onClick={()=> setShowMapModal(true)}
className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
>
<SafeIcon icon={FiMaximize2} className="text-xs" />
<span>大きな地図で見る</span>
</button>
</div>
<div className="relative bg-gray-100 rounded-lg overflow-hidden h-64 sm:h-80 md:h-96">
<PropertyMap 
properties={[property]}
selectedProperty={property}
center={property.coordinates}
zoom={16}
/>
</div>
<div className="mt-3 p-4 bg-gray-50 rounded-lg">
<div className="flex items-center space-x-2 text-gray-600 mb-2">
<SafeIcon icon={FiMapPin} className="text-sm flex-shrink-0" />
<span className="text-sm font-medium">住所</span>
</div>
<p className="text-base text-gray-900 break-all mb-3">{property.address}</p>
{property.nearestStation && (
<div className="flex items-center space-x-2 text-gray-600">
<SafeIcon icon={FiNavigation} className="text-sm flex-shrink-0" />
<span className="text-sm">
{property.nearestStation}駅
{property.walkingMinutes && ` から徒歩${property.walkingMinutes}分`}
</span>
</div>
)}
</div>
</div>
)}
</div>
</div>
</div>

{/* Sidebar */}
<div className="lg:col-span-1 space-y-6">
{/* Contact Form */}
<div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:sticky lg:top-8">
<h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
<SafeIcon icon={FiMail} />
<span>お問い合わせ</span>
</h3>
<form onSubmit={handleContactSubmit} className="space-y-4">
<div>
<label className="block text-sm font-medium text-gray-700 mb-1">
お問い合わせ種別 *
</label>
<select
name="inquiryType"
value={contactForm.inquiryType}
onChange={handleInputChange}
required
className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
>
<option value="viewing">内見希望</option>
<option value="consultation">賃貸相談</option>
<option value="contract">契約相談</option>
<option value="other">その他</option>
</select>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-1">
お名前 *
</label>
<input
type="text"
name="name"
value={contactForm.name}
onChange={handleInputChange}
required
className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
placeholder="山田 太郎"
/>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-1">
メールアドレス *
</label>
<input
type="email"
name="email"
value={contactForm.email}
onChange={handleInputChange}
required
className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
placeholder="example@email.com"
/>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-1">
電話番号
</label>
<input
type="tel"
name="phone"
value={contactForm.phone}
onChange={handleInputChange}
className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
placeholder="03-1234-5678"
/>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-1">
お問い合わせ内容
</label>
<textarea
name="message"
value={contactForm.message}
onChange={handleInputChange}
rows={4}
className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
placeholder="ご質問やご要望をお聞かせください"
/>
</div>

<button
type="submit"
className="w-full bg-primary-600 text-white py-2 sm:py-3 rounded-md font-medium text-sm sm:text-base hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
>
<SafeIcon icon={FiMail} />
<span>お問い合わせを送信</span>
</button>
</form>

{/* Contact Info */}
<div className="mt-6 pt-6 border-t border-gray-200">
<h4 className="text-sm font-semibold text-gray-900 mb-3">直接お電話でも受付中</h4>
<div className="space-y-2">
<div className="flex items-center space-x-2 text-gray-600">
<SafeIcon icon={FiPhone} className="text-sm flex-shrink-0" />
<span className="text-sm font-medium">03-1234-5678</span>
</div>
<div className="flex items-center space-x-2 text-gray-600">
<SafeIcon icon={FiClock} className="text-sm flex-shrink-0" />
<span className="text-sm">営業時間: 9:00-18:00（平日）</span>
</div>
</div>
</div>
</div>

{/* Property Info */}
<div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
<h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">物件情報</h3>
<div className="space-y-3">
<div className="flex items-center justify-between">
<span className="text-sm text-gray-600">物件ID</span>
<span className="text-sm font-medium font-mono">{getPropertyId(property)}</span>
</div>
<div className="flex items-center justify-between">
<span className="text-sm text-gray-600">データソース</span>
<span className="text-sm font-medium text-blue-600">Airtable</span>
</div>
<div className="flex items-center justify-between">
<span className="text-sm text-gray-600">最終更新</span>
<span className="text-sm font-medium">
{new Date(property.lastUpdated).toLocaleDateString('ja-JP')}
</span>
</div>
</div>
</div>
</div>
</div>

{/* Image Modal */}
{showImageModal && property.images && property.images.length > 0 && (
<div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
<div className="relative max-w-7xl max-h-full">
<img 
src={property.images[currentImageIndex]} 
alt={property.title}
className="max-w-full max-h-full object-contain"
onError={(e)=> {
e.target.style.display='none';
}}
/>
<button
onClick={()=> setShowImageModal(false)}
className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white text-xl sm:text-2xl hover:text-gray-300"
>
×
</button>
{property.images.length > 1 && (
<>
<button
onClick={prevImage}
className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 text-white text-xl sm:text-2xl hover:text-gray-300"
>
‹
</button>
<button
onClick={nextImage}
className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-white text-xl sm:text-2xl hover:text-gray-300"
>
›
</button>
</>
)}
<div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
{currentImageIndex + 1} / {property.images.length}
</div>
</div>
</div>
)}

{/* Map Modal */}
{showMapModal && property.coordinates && (
<div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
<div className="relative bg-white rounded-lg w-full max-w-6xl h-5/6 overflow-hidden">
<div className="p-4 border-b border-gray-200 flex items-center justify-between">
<div>
<h3 className="text-base sm:text-lg font-semibold text-gray-900">物件所在地</h3>
<p className="text-sm text-gray-600 break-all">{property.address}</p>
</div>
<button
onClick={()=> setShowMapModal(false)}
className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
>
<SafeIcon icon={FiX} className="text-xl" />
</button>
</div>
<div className="h-full">
<PropertyMap 
properties={[property]}
selectedProperty={property}
center={property.coordinates}
zoom={16}
/>
</div>
</div>
</div>
)}
</div>
</div>
);
};

export default PropertyDetail;