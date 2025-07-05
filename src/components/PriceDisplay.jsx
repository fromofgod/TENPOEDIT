import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {formatPrice,formatPriceWithCommas,calculateTsuboPrice,getPriceCategory} from '../utils/priceFormatter';

const {FiTrendingUp,FiTrendingDown,FiMinus,FiInfo}=FiIcons;

const PriceDisplay=({rent,area,showTsuboPrice=false,showCategory=false,showComparison=false,averageRent=null,size='normal',variant='default'})=> {
const priceCategory=getPriceCategory(rent);
const tsuboPrice=showTsuboPrice && area ? calculateTsuboPrice(rent,area) : null;

// 相場との比較
const getComparisonInfo=()=> {
if (!showComparison || !averageRent) return null;

const difference=rent - averageRent;
const percentage=Math.round((difference / averageRent) * 100);

if (Math.abs(percentage) < 5) {
return {
type: 'average',
icon: FiMinus,
text: '相場並み',
color: 'text-gray-600'
};
} else if (percentage > 0) {
return {
type: 'above',
icon: FiTrendingUp,
text: `相場より${percentage}%高い`,
color: 'text-red-600'
};
} else {
return {
type: 'below',
icon: FiTrendingDown,
text: `相場より${Math.abs(percentage)}%安い`,
color: 'text-green-600'
};
}
};

const comparison=getComparisonInfo();

const sizeClasses={
small: 'text-sm',
normal: 'text-lg',
large: 'text-xl',
xlarge: 'text-2xl'
};

const variantClasses={
default: 'text-gray-900',
primary: 'text-primary-600',
success: 'text-green-600',
warning: 'text-orange-600',
danger: 'text-red-600'
};

return (
<div className="space-y-2">
{/* メイン価格表示 */}
<div className="flex items-center space-x-2">
<span className={`${size==='small' ? 'text-xs' : 'text-sm'} text-gray-600 font-medium`}>
賃料
</span>
<span className={`font-bold ${sizeClasses[size]} ${variantClasses[variant]}`}>
{formatPrice(rent,{showYen: true,showUnit: false})}
</span>
<span className={`${size==='small' ? 'text-xs' : 'text-sm'} text-gray-500`}>
/月
</span>

{/* 価格カテゴリバッジ */}
{showCategory && (
<span className={`px-2 py-1 text-xs rounded-full font-medium ${
priceCategory.color==='green' ? 'bg-green-100 text-green-800' :
priceCategory.color==='blue' ? 'bg-blue-100 text-blue-800' :
priceCategory.color==='purple' ? 'bg-purple-100 text-purple-800' :
priceCategory.color==='orange' ? 'bg-orange-100 text-orange-800' :
'bg-red-100 text-red-800'
}`}>
{priceCategory.label}
</span>
)}
</div>

{/* 詳細価格情報 */}
<div className="space-y-1">
{/* 坪単価 */}
{tsuboPrice && (
<div className={`${size==='small' ? 'text-xs' : 'text-sm'} text-gray-600`}>
坪単価: {tsuboPrice.formatted}
</div>
)}

{/* 相場比較 */}
{comparison && (
<div className={`flex items-center space-x-1 ${size==='small' ? 'text-xs' : 'text-sm'} ${comparison.color}`}>
<SafeIcon icon={comparison.icon} className="text-xs" />
<span>{comparison.text}</span>
{averageRent && (
<span className="text-gray-500 ml-1">
(相場: {formatPrice(averageRent,{showYen: true,showUnit: false})})
</span>
)}
</div>
)}
</div>
</div>
);
};

export default PriceDisplay;