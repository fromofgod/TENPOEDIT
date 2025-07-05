import React,{useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import PriceDisplay from './PriceDisplay';
import FavoriteButton from './FavoriteButton';

const {FiMapPin,FiSquare,FiClock,FiNavigation,FiEye,FiCamera,FiImage}=FiIcons;

const PropertyCard=({property,showComparison=false,averageRent=null,onClick=null})=> {
const navigate=useNavigate();
const [imageError,setImageError]=useState(false);
const [currentImageIndex,setCurrentImageIndex]=useState(0);

const getPropertyTypeLabel=(type)=> {
const types={
restaurant: '飲食店',
retail: '小売店',
office: 'オフィス',
warehouse: '倉庫・工場',
service: 'サービス業'
};
return types[type] || type;
};

const getDaysAgo=(dateString)=> {
const postDate=new Date(dateString);
const today=new Date();
const diffTime=Math.abs(today - postDate);
const diffDays=Math.ceil(diffTime / (1000 * 60 * 60 * 24));

if (diffDays===1) return '昨日';
if (diffDays < 7) return `${diffDays}日前`;
if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
return `${Math.floor(diffDays / 30)}ヶ月前`;
};

const isNewProperty=()=> {
const daysAgoText=getDaysAgo(property.postedDate);
return daysAgoText.includes('日前') && parseInt(daysAgoText) <=3;
};

const handleImageError=()=> {
console.warn(`🖼️ Image load failed for: ${property.images[currentImageIndex]}`);
setImageError(true);
};

const handleImageLoad=()=> {
setImageError(false);
};

const nextImage=(e)=> {
e.preventDefault();
e.stopPropagation();
if (property.images && property.images.length > 1) {
setCurrentImageIndex((prev)=> 
prev===property.images.length - 1 ? 0 : prev + 1
);
}
};

const prevImage=(e)=> {
e.preventDefault();
e.stopPropagation();
if (property.images && property.images.length > 1) {
setCurrentImageIndex((prev)=> 
prev===0 ? property.images.length - 1 : prev - 1
);
}
};

// カード全体のクリックハンドラー
const handleCardClick=(e)=> {
// お気に入りボタンやナビゲーションボタンのクリックは除外
if (e.target.closest('.favorite-button') || 
e.target.closest('.image-nav-button') || 
e.target.closest('.quick-action-button')) {
return;
}

console.log('🔗 PropertyCard clicked:',property.id);

// カスタムonClickハンドラーがある場合はそれを実行
if (onClick) {
onClick(property);
return;
}

// デフォルトの詳細ページ遷移
navigate(`/property/${property.id}`);
};

// 画像の状態を判定
const hasMultipleImages=property.images && property.images.length > 1;
const currentImage=property.images && property.images[currentImageIndex] 
? property.images[currentImageIndex] 
: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop';
const isRealImage=!currentImage.includes('unsplash.com');

return (
<motion.div
whileHover={{y: -2}}
transition={{duration: 0.2}}
className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative group cursor-pointer"
onClick={handleCardClick}
>
<div className="relative">
{/* メイン画像 - 固定高さとobject-fitで調整 */}
<div className="relative w-full h-48 bg-gray-200 overflow-hidden">
{!imageError ? (
<img
src={currentImage}
alt={property.title}
className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
onError={handleImageError}
onLoad={handleImageLoad}
/>
) : (
<div className="w-full h-full bg-gray-100 flex items-center justify-center">
<div className="text-center text-gray-400">
<SafeIcon icon={FiImage} className="text-4xl mx-auto mb-2" />
<p className="text-sm">画像を読み込めません</p>
</div>
</div>
)}

{/* 画像ナビゲーション（複数画像がある場合） */}
{hasMultipleImages && !imageError && (
<>
<button
onClick={prevImage}
className="image-nav-button absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
>
<SafeIcon icon={FiNavigation} className="text-xs transform rotate-180" />
</button>
<button
onClick={nextImage}
className="image-nav-button absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
>
<SafeIcon icon={FiNavigation} className="text-xs" />
</button>
</>
)}
</div>

{/* Property Type Badge */}
<div className="absolute top-3 left-3">
<span className="bg-primary-600 text-white px-2 py-1 text-xs font-medium rounded">
{getPropertyTypeLabel(property.type)}
</span>
</div>

{/* Featured Badge */}
{property.featured && (
<div className="absolute top-3 right-12">
<span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded animate-pulse">
おすすめ
</span>
</div>
)}

{/* New Badge - 赤色に変更 */}
{isNewProperty() && (
<div className="absolute top-3 left-1/2 transform -translate-x-1/2">
<span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded animate-pulse">
新着
</span>
</div>
)}

{/* Real Image Badge - 削除 */}
{/*
{isRealImage && (
<div className="absolute top-12 left-3">
<span className="bg-blue-500 text-white px-2 py-1 text-xs font-medium rounded flex items-center space-x-1">
<SafeIcon icon={FiCamera} className="text-xs" />
<span>実写</span>
</span>
</div>
)}
*/}

{/* Train Lines - 画像部分に移動 */}
{property.trainLines && property.trainLines.length > 0 && (
<div className="absolute bottom-3 left-3">
<div className="flex flex-wrap gap-1">
{property.trainLines.slice(0,2).map((line,index)=> (
<span
key={index}
className="bg-black bg-opacity-70 text-white px-2 py-1 text-xs rounded"
>
{line.replace('東京メトロ','メトロ').replace('JR','')}
</span>
))}
{property.trainLines.length > 2 && (
<span className="bg-black bg-opacity-70 text-white px-2 py-1 text-xs rounded">
+{property.trainLines.length - 2}路線
</span>
)}
</div>
</div>
)}

{/* Image Count */}
{hasMultipleImages && (
<div className="absolute bottom-3 right-3">
<span className="bg-black bg-opacity-70 text-white px-2 py-1 text-xs rounded flex items-center space-x-1">
<SafeIcon icon={FiCamera} className="text-xs" />
<span>{currentImageIndex + 1}/{property.images.length}</span>
</span>
</div>
)}

{/* Image Dots Indicator */}
{hasMultipleImages && property.images.length <=5 && (
<div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
{property.images.map((_,index)=> (
<div
key={index}
className={`w-1.5 h-1.5 rounded-full ${
index===currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
}`}
/>
))}
</div>
)}
</div>

{/* Favorite Button */}
<div className="absolute top-3 right-3 favorite-button">
<FavoriteButton property={property} size="small" />
</div>

<div className="p-4">
<h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
{property.title}
</h3>

<div className="space-y-2 mb-4">
<div className="flex items-center space-x-2 text-gray-600">
<SafeIcon icon={FiMapPin} className="text-sm" />
<span className="text-sm">{property.ward || property.location}</span>
</div>

{property.nearestStation && (
<div className="flex items-center space-x-2 text-gray-600">
<SafeIcon icon={FiNavigation} className="text-sm" />
<span className="text-sm">
{property.nearestStation}駅 徒歩{property.walkingMinutes}分
</span>
</div>
)}

<div className="flex items-center justify-between">
<div className="flex items-center space-x-2 text-gray-600">
<SafeIcon icon={FiSquare} className="text-sm" />
<span className="text-sm">{property.area}㎡</span>
</div>
<div className="flex items-center space-x-2 text-gray-500">
<SafeIcon icon={FiClock} className="text-xs" />
<span className="text-xs">{getDaysAgo(property.postedDate)}</span>
</div>
</div>
</div>

{/* Train Lines - 画像部分に移動したため削除 */}
{/*
{property.trainLines && property.trainLines.length > 0 && (
<div className="mb-4">
<div className="flex flex-wrap gap-1">
{property.trainLines.slice(0,2).map((line,index)=> (
<span
key={index}
className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
>
{line.replace('東京メトロ','メトロ').replace('JR','')}
</span>
))}
{property.trainLines.length > 2 && (
<span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
+{property.trainLines.length - 2}路線
</span>
)}
</div>
</div>
)}
*/}

{/* Price Display - カテゴリタグを無効化 */}
<div className="border-t pt-3">
<PriceDisplay
rent={property.rent}
deposit={property.deposit}
area={property.area}
showTsuboPrice={true}
showCategory={false}
showComparison={showComparison}
averageRent={averageRent}
size="normal"
variant="primary"
/>
</div>

{/* Quick Action Button - お問い合わせボタンを削除し、詳細を見るボタンのみに */}
<div className="mt-4 pt-3 border-t border-gray-100">
<Link
to={`/property/${property.id}`}
className="quick-action-button w-full bg-primary-50 text-primary-600 py-2 px-3 rounded text-sm font-medium hover:bg-primary-100 transition-colors text-center block"
onClick={(e)=> e.stopPropagation()}
>
詳細を見る
</Link>
</div>
</div>
</motion.div>
);
};

export default PropertyCard;