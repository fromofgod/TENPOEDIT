import React,{useEffect,useRef,useState,useCallback} from 'react';
import {Link} from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {formatPrice} from '../utils/priceFormatter';

const {FiMapPin,FiNavigation,FiSquare,FiClock,FiZoomIn,FiZoomOut,FiRefreshCw,FiLayers,FiTarget,FiDatabase,FiMaximize2,FiMinimize2,FiMove,FiSearch}=FiIcons;

const GoogleMap=({properties,onPropertySelect,selectedProperty,center={lat: 35.6762,lng: 139.6503},zoom=12,onBoundsChange,onCenterChange,onZoomChange})=> {
const mapRef=useRef(null);
const [map,setMap]=useState(null);
const [markers,setMarkers]=useState([]);
const [infoWindow,setInfoWindow]=useState(null);
const [mapType,setMapType]=useState('roadmap');
const [isLoaded,setIsLoaded]=useState(false);
const [isFullscreen,setIsFullscreen]=useState(false);
const [searchQuery,setSearchQuery]=useState('');

const getPropertyTypeLabel=(type)=> {
const types={
restaurant: '飲食店',
retail: '小売店',
office: 'オフィス',
warehouse: '倉庫・工場',
service: 'サービス業',
other: 'その他'
};
return types[type] || type;
};

// Google Maps初期化（改善版）
useEffect(()=> {
if (!window.google || !mapRef.current) {
console.warn('Google Maps API not loaded or map container not ready');
return;
}

console.log('🗺️ Initializing Google Maps...');
const mapInstance=new window.google.maps.Map(mapRef.current,{
center: center,
zoom: zoom,
mapTypeId: window.google.maps.MapTypeId.ROADMAP,
// 使いやすさを向上させる設定
styles: [
{featureType: 'poi',elementType: 'labels',stylers: [{visibility: 'off'}]},
{featureType: 'transit',elementType: 'labels',stylers: [{visibility: 'simplified'}]}
],
mapTypeControl: true,
mapTypeControlOptions: {
style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
position: window.google.maps.ControlPosition.TOP_CENTER
},
zoomControl: false,// カスタムズームコントロールを使用
streetViewControl: true,
streetViewControlOptions: {
position: window.google.maps.ControlPosition.RIGHT_CENTER
},
fullscreenControl: false,// カスタムフルスクリーンコントロールを使用
gestureHandling: 'greedy',// より直感的な操作
clickableIcons: false,// POIアイコンのクリックを無効化
disableDoubleClickZoom: false,
draggable: true,
keyboardShortcuts: true,
scrollwheel: true
});

setMap(mapInstance);
setIsLoaded(true);

// InfoWindow初期化（改善版）
const infoWindowInstance=new window.google.maps.InfoWindow({
maxWidth: 380,
pixelOffset: new window.google.maps.Size(0,-10),
disableAutoPan: false
});
setInfoWindow(infoWindowInstance);

// 地図イベントリスナー
if (onBoundsChange) {
mapInstance.addListener('bounds_changed',()=> {
const bounds=mapInstance.getBounds();
if (bounds) {
onBoundsChange(bounds);
}
});
}

if (onCenterChange) {
mapInstance.addListener('center_changed',()=> {
const center=mapInstance.getCenter();
if (center) {
onCenterChange({lat: center.lat(),lng: center.lng()});
}
});
}

if (onZoomChange) {
mapInstance.addListener('zoom_changed',()=> {
const zoom=mapInstance.getZoom();
onZoomChange(zoom);
});
}

// 地図クリックでInfoWindowを閉じる
mapInstance.addListener('click',()=> {
if (infoWindowInstance) {
infoWindowInstance.close();
}
});

console.log('✅ Google Maps initialized successfully');
},[center,zoom,onBoundsChange,onCenterChange,onZoomChange]);

// 中心位置の変更を反映
useEffect(()=> {
if (map && center) {
map.setCenter(center);
}
},[map,center]);

// ズームレベルの変更を反映
useEffect(()=> {
if (map && zoom) {
map.setZoom(zoom);
}
},[map,zoom]);

// マーカー作成・更新（改善版）
useEffect(()=> {
if (!map || !window.google || !properties || !Array.isArray(properties)) {
console.log('🚫 Cannot create markers:',{map: !!map,google: !!window.google,properties: properties?.length});
return;
}

console.log(`🗺️ Creating markers for ${properties.length} properties...`);

// 既存のマーカーをクリア
markers.forEach(marker=> {
marker.setMap(null);
});

const newMarkers=[];

properties.forEach((property,index)=> {
// 座標チェック
if (!property.coordinates || !property.coordinates.lat || !property.coordinates.lng) {
console.warn(`⚠️ Property ${property.id} has no valid coordinates:`,property.coordinates);
return;
}

const position={
lat: Number(property.coordinates.lat),
lng: Number(property.coordinates.lng)
};

// 座標が有効範囲内かチェック（東京周辺）
if (position.lat < 35.0 || position.lat > 36.0 || position.lng < 139.0 || position.lng > 140.5) {
console.warn(`⚠️ Property ${property.id} coordinates out of Tokyo area:`,position);
return;
}

console.log(`📍 Creating marker ${index + 1}: ${property.title}`,position);

const isSelected=selectedProperty?.id===property.id;

// 物件種別による色分け（改善版）
const typeColors={
restaurant: '#ef4444',// 赤
retail: '#3b82f6',// 青
office: '#8b5cf6',// 紫
warehouse: '#f59e0b',// オレンジ
service: '#10b981',// 緑
other: '#6b7280' // グレー
};

const color=isSelected ? '#ec4899' : (typeColors[property.type] || '#22c55e');

// 新しいマップピンアイコン（画像に基づいたデザイン）
const icon={
url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
<defs>
<filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
<feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="rgba(0,0,0,0.3)"/>
</filter>
<linearGradient id="pinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
<stop offset="0%" style="stop-color:${color};stop-opacity:1" />
<stop offset="100%" style="stop-color:${color};stop-opacity:0.8" />
</linearGradient>
</defs>
<!-- マップピンの本体（ティアドロップ形状） -->
<path d="M20 2C11.163 2 4 9.163 4 18c0 12 16 28 16 28s16-16 16-28c0-8.837-7.163-16-16-16z" 
      fill="url(#pinGradient)" 
      stroke="#ffffff" 
      stroke-width="3" 
      filter="url(#shadow)"/>
<!-- 内側の円 -->
<circle cx="20" cy="18" r="8" fill="#ffffff" stroke="${color}" stroke-width="2"/>
<!-- 中央のドット -->
<circle cx="20" cy="18" r="4" fill="${color}"/>
<!-- ハイライト効果 -->
<ellipse cx="18" cy="15" rx="2" ry="3" fill="rgba(255,255,255,0.6)" opacity="0.8"/>
</svg>
`)}`,
scaledSize: new window.google.maps.Size(40,50),
anchor: new window.google.maps.Point(20,50)
};

try {
const marker=new window.google.maps.Marker({
position: position,
map: map,
title: property.title,
icon: icon,
animation: isSelected ? window.google.maps.Animation.BOUNCE : null,
optimized: false
});

// マーカーホバー効果（改善版）
marker.addListener('mouseover',()=> {
if (!isSelected) {
const hoverIcon={
...icon,
url: icon.url.replace(color,'#f59e0b')
};
marker.setIcon(hoverIcon);
}
});

marker.addListener('mouseout',()=> {
if (!isSelected) {
marker.setIcon(icon);
}
});

// マーカークリックイベント（改善版）
marker.addListener('click',()=> {
if (onPropertySelect) {
onPropertySelect(property);
}

// InfoWindow内容作成（改善版）
const content=`
<div class="p-4 max-w-sm">
<div class="space-y-4">
<div class="flex items-center justify-between mb-3">
<div class="flex items-center space-x-2">
<span class="bg-blue-600 text-white px-3 py-1 text-xs font-medium rounded-full">
${getPropertyTypeLabel(property.type)}
</span>
${property.featured ? '<span class="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded-full">おすすめ</span>' : ''}
</div>
<div class="flex items-center space-x-1 text-xs text-green-600">
<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
<path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
</svg>
<span>Airtable</span>
</div>
</div>
<h3 class="font-semibold text-gray-900 text-base mb-3 leading-tight">
${property.title}
</h3>
<div class="grid grid-cols-2 gap-3 text-sm text-gray-600">
<div class="flex items-center space-x-1">
<span>📍</span>
<span class="truncate">${property.ward || property.location}</span>
</div>
${property.nearestStation ? `
<div class="flex items-center space-x-1">
<span>🚶</span>
<span class="truncate">${property.nearestStation}駅</span>
</div>
` : ''}
${property.area ? `
<div class="flex items-center space-x-1">
<span>📐</span>
<span>${property.area}㎡</span>
</div>
` : ''}
${property.walkingMinutes ? `
<div class="flex items-center space-x-1">
<span>⏰</span>
<span>徒歩${property.walkingMinutes}分</span>
</div>
` : ''}
</div>
${property.rent ? `
<div class="border-t pt-3">
<div class="flex items-center space-x-2 mb-2">
<span class="text-xl font-bold text-blue-600">
${formatPrice(property.rent,{showYen: true,showUnit: false})}
</span>
<span class="text-sm text-gray-500">/月</span>
</div>
${property.deposit ? `<div class="text-xs text-gray-600">敷金: ${formatPrice(property.deposit,{compact: true})}</div>` : ''}
</div>
` : ''}
${property.description ? `
<div class="text-sm text-gray-600 line-clamp-2">
${property.description.substring(0,120)}${property.description.length > 120 ? '...' : ''}
</div>
` : ''}
<div class="pt-3 border-t grid grid-cols-2 gap-2">
<a href="#/property/${property.id}" class="block text-center bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
詳細を見る
</a>
<button onclick="window.showStreetView(${position.lat},${position.lng})" class="bg-green-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-green-700 transition-colors">
ストリートビュー
</button>
</div>
<div class="text-xs text-gray-400 border-t pt-2">
Airtable ID: ${property.id.substring(0,8)}...
</div>
</div>
</div>
`;

if (infoWindow) {
infoWindow.setContent(content);
infoWindow.open(map,marker);
}
});

newMarkers.push(marker);
console.log(`✅ Marker created successfully for property: ${property.title}`);
} catch (error) {
console.error(`❌ Error creating marker for property ${property.id}:`,error);
}
});

setMarkers(newMarkers);
console.log(`📍 Total markers created: ${newMarkers.length}/${properties.length}`);

// 地図の表示範囲を調整（物件がある場合のみ）
if (newMarkers.length > 0 && !selectedProperty) {
try {
const bounds=new window.google.maps.LatLngBounds();
newMarkers.forEach(marker=> {
bounds.extend(marker.getPosition());
});
map.fitBounds(bounds);

// ズームレベルの最大値を設定
const listener=window.google.maps.event.addListener(map,'bounds_changed',()=> {
if (map.getZoom() > 16) map.setZoom(16);
window.google.maps.event.removeListener(listener);
});
} catch (error) {
console.error('❌ Error fitting bounds:',error);
}
}
},[map,properties,selectedProperty,infoWindow,onPropertySelect]);

// 選択された物件にズーム
useEffect(()=> {
if (!map || !selectedProperty || !selectedProperty.coordinates) return;

const position={
lat: Number(selectedProperty.coordinates.lat),
lng: Number(selectedProperty.coordinates.lng)
};
map.panTo(position);

// 対応するマーカーを見つけてアニメーション
const marker=markers.find((_,index)=> properties[index]?.id===selectedProperty.id);
if (marker) {
marker.setAnimation(window.google.maps.Animation.BOUNCE);
setTimeout(()=> {
marker.setAnimation(null);
},2000);
}
},[selectedProperty,map,markers,properties]);

// カスタムコントロール関数（改善版）
const handleZoomIn=()=> {
if (map) {
map.setZoom(Math.min(map.getZoom() + 1,20));
}
};

const handleZoomOut=()=> {
if (map) {
map.setZoom(Math.max(map.getZoom() - 1,5));
}
};

const handleResetView=()=> {
if (map) {
if (properties && properties.length > 0) {
const bounds=new window.google.maps.LatLngBounds();
properties.forEach(property=> {
if (property.coordinates) {
bounds.extend(new window.google.maps.LatLng(
Number(property.coordinates.lat),
Number(property.coordinates.lng)
));
}
});
map.fitBounds(bounds);
} else {
map.setCenter(center);
map.setZoom(12);
}
}
};

const toggleMapType=()=> {
if (!map) return;
const newMapType=mapType==='roadmap' ? 'satellite' : 'roadmap';
map.setMapTypeId(window.google.maps.MapTypeId[newMapType.toUpperCase()]);
setMapType(newMapType);
};

const toggleFullscreen=()=> {
setIsFullscreen(!isFullscreen);
};

const getCurrentLocation=()=> {
if (!navigator.geolocation) {
alert('お使いのブラウザは位置情報サービスをサポートしていません。');
return;
}

navigator.geolocation.getCurrentPosition(
(position)=> {
const newCenter={
lat: position.coords.latitude,
lng: position.coords.longitude
};
map.setCenter(newCenter);
map.setZoom(15);
},
(error)=> {
console.error('位置情報取得エラー:',error);
alert('位置情報の取得に失敗しました。');
}
);
};

const handleMapSearch=()=> {
if (!searchQuery.trim() || !window.google) return;

const geocoder=new window.google.maps.Geocoder();
geocoder.geocode(
{
address: searchQuery,
region: 'JP',
language: 'ja'
},
(results,status)=> {
if (status==='OK' && results[0]) {
const location=results[0].geometry.location;
const newCenter={
lat: location.lat(),
lng: location.lng()
};
map.setCenter(newCenter);
map.setZoom(15);
setSearchQuery('');
} else {
alert('住所が見つかりませんでした。');
}
}
);
};

// グローバル関数の設定（InfoWindow内のボタン用）
useEffect(()=> {
window.showStreetView=(lat,lng)=> {
const panorama=new window.google.maps.StreetViewPanorama(
document.createElement('div'),
{
position: {lat,lng},
pov: {
heading: 34,
pitch: 10
}
}
);
map.setStreetView(panorama);
};

return ()=> {
delete window.showStreetView;
};
},[map]);

return (
<div className={`relative w-full h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
{/* Google Map */}
<div ref={mapRef} className="w-full h-full rounded-lg" />

{/* 改善されたカスタムコントロール */}
<div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
{/* フルスクリーンボタン */}
<button
onClick={toggleFullscreen}
className="bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50 transition-colors border"
title={isFullscreen ? 'フルスクリーン終了' : 'フルスクリーン'}
>
<SafeIcon icon={isFullscreen ? FiMinimize2 : FiMaximize2} className="text-gray-700" />
</button>

{/* ズームコントロール */}
<div className="bg-white shadow-lg rounded-lg border overflow-hidden">
<button
onClick={handleZoomIn}
className="block w-full p-3 hover:bg-gray-50 transition-colors border-b"
title="ズームイン"
>
<SafeIcon icon={FiZoomIn} className="text-gray-700" />
</button>
<button
onClick={handleZoomOut}
className="block w-full p-3 hover:bg-gray-50 transition-colors"
title="ズームアウト"
>
<SafeIcon icon={FiZoomOut} className="text-gray-700" />
</button>
</div>

{/* その他のコントロール */}
<button
onClick={toggleMapType}
className="bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50 transition-colors border"
title={mapType==='roadmap' ? '衛星写真' : '地図'}
>
<SafeIcon icon={FiLayers} className="text-gray-700" />
</button>

<button
onClick={getCurrentLocation}
className="bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50 transition-colors border"
title="現在地"
>
<SafeIcon icon={FiTarget} className="text-gray-700" />
</button>

<button
onClick={handleResetView}
className="bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50 transition-colors border"
title="全体表示"
>
<SafeIcon icon={FiRefreshCw} className="text-gray-700" />
</button>
</div>

{/* 検索バー */}
<div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
<div className="bg-white shadow-lg rounded-lg px-4 py-2 flex items-center space-x-2">
<input
type="text"
value={searchQuery}
onChange={(e)=> setSearchQuery(e.target.value)}
onKeyPress={(e)=> e.key==='Enter' && handleMapSearch()}
placeholder="住所や駅名で地図を検索"
className="border-none outline-none text-sm w-48"
/>
<button
onClick={handleMapSearch}
className="text-blue-600 hover:text-blue-700"
>
<SafeIcon icon={FiSearch} />
</button>
</div>
</div>

{/* 操作ヒント */}
<div className="absolute bottom-4 left-4 bg-white bg-opacity-95 rounded-lg px-3 py-2 text-xs text-gray-600 shadow-lg z-10">
<div className="space-y-1">
<div className="flex items-center space-x-1">
<SafeIcon icon={FiDatabase} className="text-xs text-blue-600" />
<span className="font-medium">操作ヒント</span>
</div>
<div>🖱️ ドラッグで移動・ホイールでズーム</div>
<div>📍 マーカークリックで詳細表示</div>
<div>🎨 色分け: 物件種別ごと</div>
</div>
</div>

{/* フルスクリーン時の閉じるボタン */}
{isFullscreen && (
<button
onClick={toggleFullscreen}
className="absolute top-4 left-4 bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50 transition-colors border z-20"
title="フルスクリーン終了"
>
<SafeIcon icon={FiMinimize2} className="text-gray-700" />
</button>
)}

{/* ローディング表示 */}
{!isLoaded && (
<div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
<div className="text-center">
<SafeIcon icon={FiMapPin} className="text-4xl text-gray-400 mx-auto mb-4 animate-pulse" />
<p className="text-gray-600">地図を読み込み中...</p>
<div className="mt-2 w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
<div className="h-full bg-blue-500 animate-pulse"></div>
</div>
</div>
</div>
)}

{/* No Markers Warning */}
{isLoaded && properties?.length > 0 && markers.length===0 && (
<div className="absolute inset-0 bg-gray-100 bg-opacity-90 flex items-center justify-center rounded-lg">
<div className="text-center bg-white p-6 rounded-lg shadow-lg">
<SafeIcon icon={FiMapPin} className="text-6xl text-orange-400 mx-auto mb-4" />
<h3 className="text-lg font-semibold text-gray-900 mb-2">
マーカーが表示されていません
</h3>
<p className="text-gray-600 mb-4">
物件に座標データが設定されていない可能性があります
</p>
<div className="text-sm text-gray-500">
<p>• 物件数: {properties.length}件</p>
<p>• 座標あり: {properties.filter(p=> p.coordinates).length}件</p>
</div>
</div>
</div>
)}
</div>
);
};

export default GoogleMap;