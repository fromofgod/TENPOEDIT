import React,{useState,useEffect} from 'react';
import {useSearchParams} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import PropertyCard from '../components/PropertyCard';
import {useAirtableProperties} from '../hooks/useAirtableProperties';
import {useTrainLines} from '../hooks/useTrainLines';
import {tokyoAreasFromCSV,tokyoWards,tokyoCities} from '../data/tokyoAreas';

const {FiFilter,FiGrid,FiList,FiChevronDown,FiMapPin,FiDatabase,FiLoader,FiChevronLeft,FiChevronRight}=FiIcons;

const SearchPage=()=> {
const [searchParams]=useSearchParams();
const {properties,loading,error,searchPropertiesWithFilters}=useAirtableProperties();
const {trainLines,loading: trainLinesLoading,getStationsByLineName}=useTrainLines();
const [filteredProperties,setFilteredProperties]=useState([]);
const [viewMode,setViewMode]=useState('grid');
const [sortBy,setSortBy]=useState('newest');
const [showFilters,setShowFilters]=useState(false);
const [currentPage,setCurrentPage]=useState(1);
const [propertiesPerPage]=useState(12); // 1ページあたりの表示件数
const [filters,setFilters]=useState({
propertyType: searchParams.get('propertyType') || '',
area: searchParams.get('area') || '',
trainLine: searchParams.get('trainLine') || '',
station: searchParams.get('station') || '',
priceRange: searchParams.get('priceRange') || '',
walkingMinutes: searchParams.get('walkingMinutes') || '',
keyword: searchParams.get('keyword') || ''
});

// 選択された沿線に基づいて利用可能な駅を取得
const getAvailableStations=()=> {
if (!filters.trainLine) return [];
return getStationsByLineName(filters.trainLine);
};

useEffect(()=> {
filterProperties();
},[properties,filters,sortBy]);

// フィルターが変更された時にページを1に戻す
useEffect(()=> {
setCurrentPage(1);
},[filters,sortBy]);

// 沿線が変更された時に駅をリセット
useEffect(()=> {
if (filters.trainLine && filters.station) {
const availableStations=getAvailableStations();
if (!availableStations.includes(filters.station)) {
setFilters(prev=> ({...prev,station: ''}));
}
}
},[filters.trainLine,trainLines]);

const filterProperties=()=> {
if (!properties.length) {
setFilteredProperties([]);
return;
}

let filtered=[...properties];

// Apply filters
if (filters.propertyType) {
filtered=filtered.filter(p=> p.type===filters.propertyType);
}

if (filters.area) {
filtered=filtered.filter(p=> 
p.ward===filters.area || 
p.location?.includes(filters.area) || 
p.address?.includes(filters.area) || 
(p.ward && p.ward.includes(filters.area))
);
}

if (filters.station) {
filtered=filtered.filter(p=> 
p.nearestStation && p.nearestStation.includes(filters.station)
);
}

if (filters.trainLine) {
filtered=filtered.filter(p=> 
p.trainLines && p.trainLines.some(line=> 
line.includes(filters.trainLine)
)
);
}

if (filters.keyword) {
filtered=filtered.filter(p=> 
p.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
(p.address && p.address.toLowerCase().includes(filters.keyword.toLowerCase())) ||
(p.ward && p.ward.toLowerCase().includes(filters.keyword.toLowerCase())) ||
(p.nearestStation && p.nearestStation.toLowerCase().includes(filters.keyword.toLowerCase())) ||
(p.equipment && p.equipment.toLowerCase().includes(filters.keyword.toLowerCase()))
);
}

if (filters.priceRange) {
const [min,max]=filters.priceRange.split('-').map(Number);
filtered=filtered.filter(p=> {
if (!p.rent) return false;
if (max) return p.rent >=min && p.rent <=max;
return p.rent >=min;
});
}

if (filters.walkingMinutes) {
const [,maxWalk]=filters.walkingMinutes.split('-').map(Number);
filtered=filtered.filter(p=> 
p.walkingMinutes && p.walkingMinutes <=maxWalk
);
}

// Apply sorting
switch (sortBy) {
case 'price-low':
filtered.sort((a,b)=> (a.rent || 0) - (b.rent || 0));
break;
case 'price-high':
filtered.sort((a,b)=> (b.rent || 0) - (a.rent || 0));
break;
case 'area-large':
filtered.sort((a,b)=> (b.area || 0) - (a.area || 0));
break;
case 'walking-close':
filtered.sort((a,b)=> (a.walkingMinutes || 999) - (b.walkingMinutes || 999));
break;
case 'newest':
default:
filtered.sort((a,b)=> new Date(b.lastUpdated) - new Date(a.lastUpdated));
break;
}

setFilteredProperties(filtered);
};

const handleFilterChange=(key,value)=> {
setFilters(prev=> ({...prev,[key]: value}));
};

const clearFilters=()=> {
setFilters({
propertyType: '',
area: '',
trainLine: '',
station: '',
priceRange: '',
walkingMinutes: '',
keyword: ''
});
};

// ページネーション計算
const totalPages=Math.ceil(filteredProperties.length / propertiesPerPage);
const startIndex=(currentPage - 1) * propertiesPerPage;
const endIndex=startIndex + propertiesPerPage;
const currentProperties=filteredProperties.slice(startIndex,endIndex);

// ページネーション関数
const goToPage=(page)=> {
setCurrentPage(page);
// ページ変更時にトップにスクロール
window.scrollTo({top: 0,behavior: 'smooth'});
};

const goToPreviousPage=()=> {
if (currentPage > 1) {
goToPage(currentPage - 1);
}
};

const goToNextPage=()=> {
if (currentPage < totalPages) {
goToPage(currentPage + 1);
}
};

// ページネーション表示用のページ番号配列を生成
const getPageNumbers=()=> {
const pages=[];
const maxVisiblePages=5;
let start=Math.max(1,currentPage - Math.floor(maxVisiblePages / 2));
let end=Math.min(totalPages,start + maxVisiblePages - 1);

// 右端の調整
if (end - start + 1 < maxVisiblePages) {
start=Math.max(1,end - maxVisiblePages + 1);
}

for (let i=start;i <=end;i++) {
pages.push(i);
}

return pages;
};

const propertyTypes=[ 
{value: '',label: 'すべて'},
{value: 'restaurant',label: '飲食店'},
{value: 'retail',label: '小売店'},
{value: 'office',label: 'オフィス'},
{value: 'warehouse',label: '倉庫・工場'},
{value: 'service',label: 'サービス業'},
{value: 'residential',label: '住宅'},
{value: 'other',label: 'その他'}
];

const priceRanges=[ 
{value: '',label: 'すべて'},
{value: '0-100000',label: '10万円以下'},
{value: '100000-300000',label: '10万円〜30万円'},
{value: '300000-500000',label: '30万円〜50万円'},
{value: '500000-1000000',label: '50万円〜100万円'},
{value: '1000000-',label: '100万円以上'}
];

const walkingOptions=[ 
{value: '',label: 'すべて'},
{value: '1-3',label: '徒歩3分以内'},
{value: '1-5',label: '徒歩5分以内'},
{value: '1-10',label: '徒歩10分以内'},
{value: '1-15',label: '徒歩15分以内'}
];

const sortOptions=[ 
{value: 'newest',label: '新着順'},
{value: 'price-low',label: '賃料安い順'},
{value: 'price-high',label: '賃料高い順'},
{value: 'area-large',label: '面積広い順'},
{value: 'walking-close',label: '駅近い順'}
];

if (error) {
return (
<div className="min-h-screen bg-gray-50 py-8">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="text-center">
<SafeIcon icon={FiDatabase} className="text-6xl text-red-400 mx-auto mb-4" />
<h2 className="text-xl font-semibold text-gray-900 mb-2">
Airtableからのデータ読み込みに失敗しました
</h2>
<p className="text-gray-600 mb-6">{error}</p>
<button
onClick={()=> window.location.reload()}
className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
>
再読み込み
</button>
</div>
</div>
</div>
);
}

return (
<div className="min-h-screen bg-gray-50 py-8">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
{/* Header */}
<div className="mb-8">
<div className="flex items-center space-x-2 mb-2">
<h1 className="text-3xl font-bold text-gray-900">物件検索</h1>
<div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
<SafeIcon icon={FiDatabase} className="text-xs" />
<span>Airtable連携</span>
</div>
</div>
<p className="text-gray-600">
{loading ? 'データを読み込み中...' : `${filteredProperties.length}件の物件が見つかりました（${startIndex + 1}-${Math.min(endIndex,filteredProperties.length)}件目を表示）`}
</p>

{/* Active Filters Display */}
{Object.values(filters).some(filter=> filter) && (
<div className="mt-4 flex flex-wrap gap-2">
{Object.entries(filters).map(([key,value])=> {
if (!value) return null;
return (
<span
key={key}
className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
>
{value}
<button
onClick={()=> handleFilterChange(key,'')}
className="ml-2 text-primary-600 hover:text-primary-800"
>
×
</button>
</span>
);
})}
<button
onClick={clearFilters}
className="text-sm text-gray-500 hover:text-gray-700 underline"
>
すべてクリア
</button>
</div>
)}
</div>

{/* Filters and Controls */}
<div className="bg-white rounded-lg shadow-sm p-6 mb-8">
<div className="flex flex-wrap items-center justify-between gap-4 mb-4">
<button
onClick={()=> setShowFilters(!showFilters)}
className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
>
<SafeIcon icon={FiFilter} />
<span>詳細フィルター</span>
<SafeIcon icon={FiChevronDown} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
</button>

<div className="flex items-center space-x-4">
<select
value={sortBy}
onChange={(e)=> setSortBy(e.target.value)}
className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
>
{sortOptions.map(option=> (
<option key={option.value} value={option.value}>
{option.label}
</option>
))}
</select>

<div className="flex border border-gray-300 rounded-md overflow-hidden">
<button
onClick={()=> setViewMode('grid')}
className={`p-2 ${viewMode==='grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
>
<SafeIcon icon={FiGrid} />
</button>
<button
onClick={()=> setViewMode('list')}
className={`p-2 ${viewMode==='list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
>
<SafeIcon icon={FiList} />
</button>
</div>
</div>
</div>

{/* Filter Form */}
{showFilters && (
<motion.div
initial={{opacity: 0,height: 0}}
animate={{opacity: 1,height: 'auto'}}
exit={{opacity: 0,height: 0}}
className="border-t pt-4"
>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
<div>
<label className="block text-sm font-medium text-gray-700 mb-1">
キーワード
</label>
<input
type="text"
value={filters.keyword}
onChange={(e)=> handleFilterChange('keyword',e.target.value)}
placeholder="物件名、エリアなど"
className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
/>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-1">
エリア ({tokyoAreasFromCSV.length}地域)
</label>
<select
value={filters.area}
onChange={(e)=> handleFilterChange('area',e.target.value)}
className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
>
<option value="">すべて</option>
<optgroup label="東京23区">
{tokyoWards.sort().map((ward)=> (
<option key={ward} value={ward}>{ward}</option>
))}
</optgroup>
<optgroup label="市町村">
{tokyoCities.sort().map((city)=> (
<option key={city} value={city}>{city}</option>
))}
</optgroup>
</select>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-1">
沿線
</label>
<select
value={filters.trainLine}
onChange={(e)=> handleFilterChange('trainLine',e.target.value)}
disabled={trainLinesLoading}
className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
>
<option value="">
{trainLinesLoading ? '読み込み中...' : 'すべて'}
</option>
{trainLines.map(line=> (
<option key={line.id} value={line.name}>
{line.name} ({line.company})
</option>
))}
</select>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-1">
駅名
</label>
<select
value={filters.station}
onChange={(e)=> handleFilterChange('station',e.target.value)}
disabled={!filters.trainLine || trainLinesLoading}
className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 ${
!filters.trainLine || trainLinesLoading ? 'bg-gray-100 cursor-not-allowed' : ''
}`}
>
<option value="">
{trainLinesLoading ? '読み込み中...' : filters.trainLine ? 'すべて' : '先に沿線を選択'}
</option>
{getAvailableStations().map(station=> (
<option key={station} value={station}>{station}</option>
))}
</select>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-1">
物件種別
</label>
<select
value={filters.propertyType}
onChange={(e)=> handleFilterChange('propertyType',e.target.value)}
className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
>
{propertyTypes.map(type=> (
<option key={type.value} value={type.value}>
{type.label}
</option>
))}
</select>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-1">
賃料
</label>
<select
value={filters.priceRange}
onChange={(e)=> handleFilterChange('priceRange',e.target.value)}
className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
>
{priceRanges.map(range=> (
<option key={range.value} value={range.value}>
{range.label}
</option>
))}
</select>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-1">
駅からの距離
</label>
<select
value={filters.walkingMinutes}
onChange={(e)=> handleFilterChange('walkingMinutes',e.target.value)}
className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
>
{walkingOptions.map(option=> (
<option key={option.value} value={option.value}>
{option.label}
</option>
))}
</select>
</div>
</div>

<div className="flex justify-between items-center">
<div className="text-sm text-gray-500">
{tokyoAreasFromCSV.length}市区町村・{trainLines.length > 0 ? `${trainLines.length}路線のデータで検索可能` : '沿線データを準備中...'}
</div>
<button
onClick={clearFilters}
className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
>
すべてクリア
</button>
</div>
</motion.div>
)}
</div>

{/* Loading State */}
{loading && (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{[...Array(6)].map((_,index)=> (
<div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
<div className="w-full h-48 bg-gray-200"></div>
<div className="p-4">
<div className="h-4 bg-gray-200 rounded mb-2"></div>
<div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
<div className="h-3 bg-gray-200 rounded mb-2"></div>
<div className="h-3 bg-gray-200 rounded w-1/2"></div>
</div>
</div>
))}
</div>
)}

{/* Results */}
{!loading && (
<div className={`grid gap-6 ${viewMode==='grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
{currentProperties.map((property,index)=> (
<motion.div
key={property.id}
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
transition={{duration: 0.3,delay: index * 0.05}}
>
<PropertyCard property={property} />
</motion.div>
))}
</div>
)}

{/* No Results */}
{!loading && filteredProperties.length===0 && (
<div className="text-center py-12">
<SafeIcon icon={FiMapPin} className="text-6xl text-gray-400 mx-auto mb-4" />
<p className="text-gray-500 text-lg mb-2">
条件に合う物件が見つかりませんでした。
</p>
<p className="text-gray-400 mb-6">
検索条件を変更して再検索してみてください。
</p>
<button
onClick={clearFilters}
className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
>
検索条件をリセット
</button>
</div>
)}

{/* Pagination */}
{!loading && filteredProperties.length > 0 && totalPages > 1 && (
<div className="mt-12 flex flex-col items-center">
{/* ページ情報 */}
<div className="text-sm text-gray-600 mb-4">
{startIndex + 1}-{Math.min(endIndex,filteredProperties.length)}件目 / 全{filteredProperties.length}件
</div>

{/* ページネーション */}
<nav className="flex items-center space-x-2">
{/* 前へボタン */}
<button
onClick={goToPreviousPage}
disabled={currentPage===1}
className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
currentPage===1
? 'text-gray-400 cursor-not-allowed'
: 'text-gray-700 hover:bg-gray-100'
}`}
>
<SafeIcon icon={FiChevronLeft} className="text-sm" />
<span>前へ</span>
</button>

{/* 最初のページ */}
{getPageNumbers()[0] > 1 && (
<>
<button
onClick={()=> goToPage(1)}
className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
>
1
</button>
{getPageNumbers()[0] > 2 && (
<span className="px-2 py-2 text-gray-400">...</span>
)}
</>
)}

{/* ページ番号 */}
{getPageNumbers().map((page)=> (
<button
key={page}
onClick={()=> goToPage(page)}
className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
currentPage===page
? 'bg-primary-600 text-white'
: 'text-gray-700 hover:bg-gray-100'
}`}
>
{page}
</button>
))}

{/* 最後のページ */}
{getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
<>
{getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
<span className="px-2 py-2 text-gray-400">...</span>
)}
<button
onClick={()=> goToPage(totalPages)}
className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
>
{totalPages}
</button>
</>
)}

{/* 次へボタン */}
<button
onClick={goToNextPage}
disabled={currentPage===totalPages}
className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
currentPage===totalPages
? 'text-gray-400 cursor-not-allowed'
: 'text-gray-700 hover:bg-gray-100'
}`}
>
<span>次へ</span>
<SafeIcon icon={FiChevronRight} className="text-sm" />
</button>
</nav>
</div>
)}

{/* Status Info */}
{!loading && filteredProperties.length > 0 && (
<div className="mt-12 bg-blue-50 rounded-lg p-6">
<h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center space-x-2">
<SafeIcon icon={FiDatabase} />
<span>データ連携状況</span>
</h3>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
<div>
<h4 className="font-medium mb-2">物件データ</h4>
<p>Airtableから{properties.length}件の物件データを取得済み</p>
</div>
<div>
<h4 className="font-medium mb-2">エリアデータ</h4>
<p>東京都{tokyoAreasFromCSV.length}市区町村をカバー</p>
</div>
<div>
<h4 className="font-medium mb-2">沿線データ</h4>
<p>
{trainLines.length > 0 ? `${trainLines.length}路線のデータを抽出済み` : '物件データから沿線情報を抽出中'}
</p>
</div>
</div>
</div>
)}
</div>
</div>
);
};

export default SearchPage;