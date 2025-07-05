// 価格フォーマット用のユーティリティ関数

export const formatPrice=(price,options={})=> {
const {showYen=false,showUnit=true,compact=false,decimalPlaces=0}=options;

if (!price || price===0) return '応談';

const numPrice=parseInt(price);

if (compact) {
// コンパクト表示（地図用など）
if (numPrice >=1000000) {
return `${Math.round(numPrice / 10000)}万`;
} else if (numPrice >=10000) {
return `${Math.round(numPrice / 10000)}万`;
} else {
return `${Math.round(numPrice / 1000)}千`;
}
}

// 通常表示
let formattedPrice;
if (numPrice >=10000) {
const manPrice=numPrice / 10000;
if (manPrice >=100) {
formattedPrice=`${Math.round(manPrice)}万`;
} else if (manPrice >=10) {
formattedPrice=`${Math.round(manPrice * 10) / 10}万`;
} else {
formattedPrice=`${Math.round(manPrice * 100) / 100}万`;
}
} else {
formattedPrice=new Intl.NumberFormat('ja-JP').format(numPrice);
}

let result='';
if (showYen) result +='¥';
result +=formattedPrice;
if (showUnit && numPrice >=10000) result +='円';

return result;
};

export const formatPriceWithCommas=(price)=> {
if (!price || price===0) return '応談';
return `¥${new Intl.NumberFormat('ja-JP').format(parseInt(price))}`;
};

export const calculateTsuboPrice=(rent,area)=> {
if (!rent || !area) return null;

// 1坪=3.3058㎡
const tsuboArea=area / 3.3058;
const tsuboPrice=Math.round(rent / tsuboArea);

return {
price: tsuboPrice,
formatted: `¥${new Intl.NumberFormat('ja-JP').format(tsuboPrice)}/坪`
};
};

export const getPriceCategory=(rent)=> {
if (rent < 100000) return {label: '格安',color: 'green'};
if (rent < 300000) return {label: '標準',color: 'blue'};
if (rent < 500000) return {label: '高級',color: 'purple'};
if (rent < 1000000) return {label: 'プレミアム',color: 'orange'};
return {label: 'ラグジュアリー',color: 'red'};
};