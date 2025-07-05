import React,{useEffect,useState} from 'react';
import {Link,useNavigate,useLocation} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import SearchForm from '../components/SearchForm';
import PropertyCard from '../components/PropertyCard';
import AirtableDebugPanel from '../components/AirtableDebugPanel';
import {useAirtableProperties} from '../hooks/useAirtableProperties';

const {FiSearch,FiTrendingUp,FiUsers,FiShield,FiArrowRight,FiMapPin,FiNavigation,FiMessageCircle,FiMap,FiTool,FiBookOpen,FiLink,FiFileText,FiDatabase,FiAlertCircle,FiChevronLeft,FiChevronRight,FiPause,FiPlay}=FiIcons;

const HomePage=()=> {
const {properties,loading,error,stats,connectionStatus}=useAirtableProperties();
const [featuredProperties,setFeaturedProperties]=useState([]);
const [newProperties,setNewProperties]=useState([]);
const [currentSlide,setCurrentSlide]=useState(0);
const [isAutoPlaying,setIsAutoPlaying]=useState(true);
const [isHovered,setIsHovered]=useState(false);
const navigate=useNavigate();

useEffect(()=> {
if (properties.length > 0) {
// 注目の物件
const featured=properties
.filter(p=> p.featured || p.coordinates)
.sort((a,b)=> new Date(b.lastUpdated) - new Date(a.lastUpdated))
.slice(0,6);
setFeaturedProperties(featured);

// 新着物件（最新9件に変更 - 3件x3ページ）
const newest=properties
.sort((a,b)=> new Date(b.lastUpdated) - new Date(a.lastUpdated))
.slice(0,9);
setNewProperties(newest);
}
},[properties]);

// カルーセルの自動再生（3件表示に対応）
useEffect(()=> {
if (!isAutoPlaying || isHovered || newProperties.length===0) return;

const interval=setInterval(()=> {
setCurrentSlide((prev)=> {
// 3件表示なので、newProperties.length - 3 がmax
const maxSlides=Math.max(0,Math.ceil(newProperties.length / 3) - 1);
return prev >=maxSlides ? 0 : prev + 1;
});
},4000);

return ()=> clearInterval(interval);
},[isAutoPlaying,isHovered,newProperties.length]);

const handleNavigation=(path)=> {
try {
navigate(path);
} catch (error) {
console.error('❌ Navigation error:',error);
window.location.href=path;
}
};

const nextSlide=()=> {
const maxSlides=Math.max(0,Math.ceil(newProperties.length / 3) - 1);
setCurrentSlide(prev=> prev >=maxSlides ? 0 : prev + 1);
};

const prevSlide=()=> {
const maxSlides=Math.max(0,Math.ceil(newProperties.length / 3) - 1);
setCurrentSlide(prev=> prev===0 ? maxSlides : prev - 1);
};

const goToSlide=(index)=> {
setCurrentSlide(index);
};

// 現在のスライドで表示する物件を取得
const getCurrentSlideProperties=()=> {
const startIndex=currentSlide * 3;
return newProperties.slice(startIndex,startIndex + 3);
};

// 新着物件数を計算（過去30日以内）
const getNewPropertiesCount=()=> {
if (!properties.length) return 0;
const thirtyDaysAgo=new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

return properties.filter(property=> {
const updatedDate=new Date(property.lastUpdated);
return updatedDate >= thirtyDaysAgo;
}).length;
};

// サンプル統計データ（実際のシステムでは実データを使用）
const getDisplayStats=()=> {
const newCount=getNewPropertiesCount();
const totalCount=stats?.total || properties.length || 0;

return {
newProperties: newCount,
totalProperties: totalCount,
members: 1250, // サンプル会員数
contracts: 890  // サンプル契約件数
};
};

const storeInfoSections=[
{
icon: FiTool,
title: '開業サポート',
description: '店舗開業に必要な手続きから資金調達まで専門スタッフがサポート',
link: '/opening-support',
color: 'bg-emerald-100 text-emerald-600'
},
{
icon: FiTrendingUp,
title: '飲食店最新ニュース',
description: '業界動向、トレンド情報、成功事例など飲食業界の最新情報',
link: '/restaurant-news',
color: 'bg-green-100 text-green-600'
},
{
icon: FiLink,
title: '業者リンク',
description: '内装業者、設備会社、デザイナーなど信頼できるパートナー企業',
link: '/business-links',
color: 'bg-teal-100 text-teal-600'
},
{
icon: FiFileText,
title: '不動産ブログ',
description: '物件選びのコツ、立地分析、契約のポイントなど役立つ情報',
link: '/real-estate-blog',
color: 'bg-lime-100 text-lime-600'
}
];

if (error) {
return (
<div className="min-h-screen bg-gray-50 flex items-center justify-center">
<div className="text-center max-w-md mx-auto p-6">
<SafeIcon icon={FiAlertCircle} className="text-6xl text-red-400 mx-auto mb-4" />
<h2 className="text-xl font-semibold text-gray-900 mb-2">
Airtableデータの読み込みに失敗しました
</h2>
<p className="text-gray-600 mb-6">
{error}
</p>
<button
onClick={()=> window.location.reload()}
className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
>
再読み込み
</button>
</div>
</div>
);
}

const displayStats=getDisplayStats();

return (
<div className="min-h-screen">
<AirtableDebugPanel properties={properties} stats={stats} />

{/* Hero Section - 緑基調に変更 */}
<section className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white overflow-hidden">
<div 
className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35"
style={{backgroundImage: "url('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&h=1080&fit=crop')"}}
/>
<div className="absolute inset-0 bg-gradient-to-br from-green-800/60 via-emerald-700/50 to-teal-600/60" />
<div className="absolute top-20 right-10 w-32 h-32 bg-white/8 rounded-full blur-xl" />
<div className="absolute bottom-20 left-10 w-24 h-24 bg-green-300/15 rounded-full blur-lg" />

<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
transition={{duration: 0.8}}
className="text-center"
>
{loading && (
<div className="flex items-center justify-center space-x-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
<div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
<span className="text-white text-sm">データ読み込み中...</span>
</div>
)}

<h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
東京都内の
<br />
<span className="text-green-200">理想の店舗物件</span>を見つけよう
</h1>

<p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
飲食店舗物件の検索ならお任せ下さい。東京都内の最新物件情報をいち早くお届けいたします。
</p>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
<div className="bg-white/15 backdrop-blur-sm rounded-lg p-4">
<div className="text-2xl font-bold text-white">{displayStats.newProperties}</div>
<div className="text-green-100 text-sm">新着物件数</div>
</div>
<div className="bg-white/15 backdrop-blur-sm rounded-lg p-4">
<div className="text-2xl font-bold text-white">{displayStats.totalProperties}</div>
<div className="text-green-100 text-sm">総物件数</div>
</div>
<div className="bg-white/15 backdrop-blur-sm rounded-lg p-4">
<div className="text-2xl font-bold text-white">{displayStats.members.toLocaleString()}</div>
<div className="text-green-100 text-sm">会員数</div>
</div>
<div className="bg-white/15 backdrop-blur-sm rounded-lg p-4">
<div className="text-2xl font-bold text-white">{displayStats.contracts.toLocaleString()}</div>
<div className="text-green-100 text-sm">契約件数</div>
</div>
</div>

<div className="flex flex-col sm:flex-row gap-4 justify-center">
<button
type="button"
onClick={()=> handleNavigation('/search')}
className="inline-flex items-center justify-center space-x-2 bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
>
<SafeIcon icon={FiSearch} />
<span>物件を検索する</span>
</button>
<button
type="button"
onClick={()=> handleNavigation('/map-search')}
className="inline-flex items-center justify-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-all duration-300 transform hover:scale-105"
>
<SafeIcon icon={FiMap} />
<span>地図から検索</span>
</button>
</div>
</motion.div>
</div>
</section>

{/* Search Form Section */}
<section className="py-16 bg-white">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
transition={{duration: 0.8,delay: 0.2}}
>
<SearchForm />
</motion.div>
</div>
</section>

{/* New Properties Carousel */}
{newProperties.length > 0 && (
<section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
transition={{duration: 0.8,delay: 0.3}}
>
{/* Header */}
<div className="flex justify-between items-center mb-8">
<div>
<h2 className="text-3xl font-bold text-gray-900 mb-2">新着物件</h2>
<p className="text-lg text-gray-600">Airtableから取得した最新の物件情報</p>
</div>

{/* Controls */}
<div className="flex items-center space-x-4">
<button
onClick={()=> setIsAutoPlaying(!isAutoPlaying)}
className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
title={isAutoPlaying ? '自動再生を停止' : '自動再生を開始'}
>
<SafeIcon icon={isAutoPlaying ? FiPause : FiPlay} className="text-gray-600" />
</button>
<div className="flex space-x-2">
<button
onClick={prevSlide}
className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
>
<SafeIcon icon={FiChevronLeft} className="text-gray-600" />
</button>
<button
onClick={nextSlide}
className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
>
<SafeIcon icon={FiChevronRight} className="text-gray-600" />
</button>
</div>
</div>
</div>

{/* Carousel - 3件表示でサイズ統一 */}
<div 
className="relative overflow-hidden"
onMouseEnter={()=> setIsHovered(true)}
onMouseLeave={()=> setIsHovered(false)}
>
<motion.div
key={currentSlide}
initial={{opacity: 0,x: 50}}
animate={{opacity: 1,x: 0}}
exit={{opacity: 0,x: -50}}
transition={{duration: 0.5,ease: "easeInOut"}}
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
>
{getCurrentSlideProperties().map((property,index)=> (
<motion.div
key={property.id}
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
transition={{duration: 0.5,delay: index * 0.1}}
>
<PropertyCard property={property} />
</motion.div>
))}
</motion.div>
</div>

{/* Dots Indicator */}
{newProperties.length > 3 && (
<div className="flex justify-center mt-6 space-x-2">
{Array.from({length: Math.ceil(newProperties.length / 3)}).map((_,index)=> (
<button
key={index}
onClick={()=> goToSlide(index)}
className={`w-3 h-3 rounded-full transition-colors ${
currentSlide===index 
? 'bg-green-600' 
: 'bg-gray-300 hover:bg-gray-400'
}`}
/>
))}
</div>
)}

{/* View All Link */}
<div className="text-center mt-8">
<Link 
to="/search?sort=newest"
className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-colors"
>
<span>新着物件をすべて見る</span>
<SafeIcon icon={FiArrowRight} />
</Link>
</div>
</motion.div>
</div>
</section>
)}

{/* Featured Properties Section */}
{featuredProperties.length > 0 && (
<section className="py-16 bg-gray-50">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
transition={{duration: 0.8,delay: 0.4}}
>
<h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">注目の物件</h2>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{featuredProperties.map((property,index)=> (
<motion.div
key={property.id}
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
transition={{duration: 0.5,delay: 0.6 + index * 0.1}}
>
<PropertyCard property={property} />
</motion.div>
))}
</div>
<div className="text-center mt-8">
<button
onClick={()=> handleNavigation('/search')}
className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
>
<span>すべての物件を見る</span>
<SafeIcon icon={FiArrowRight} />
</button>
</div>
</motion.div>
</div>
</section>
)}

{/* Store Info Sections */}
<section className="py-16 bg-white">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
transition={{duration: 0.8,delay: 0.6}}
>
<h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">店舗開業サポート</h2>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
{storeInfoSections.map((section,index)=> (
<motion.div
key={section.title}
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
transition={{duration: 0.5,delay: 0.8 + index * 0.1}}
className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
onClick={()=> handleNavigation(section.link)}
>
<div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${section.color}`}>
<SafeIcon icon={section.icon} className="text-xl" />
</div>
<h3 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h3>
<p className="text-gray-600 text-sm leading-relaxed">{section.description}</p>
</motion.div>
))}
</div>
</motion.div>
</div>
</section>
</div>
);
};

export default HomePage;