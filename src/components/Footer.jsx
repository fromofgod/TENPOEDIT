import React from 'react';
import {Link} from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {useCompanyInfo} from '../hooks/useCompanyInfo';

const {FiHome,FiMail,FiPhone,FiMapPin,FiFax,FiClock,FiExternalLink,FiDatabase,FiTwitter,FiFacebook,FiInstagram,FiLinkedin,FiGlobe}=FiIcons;

const Footer=()=> {
const {companyInfo,loading}=useCompanyInfo();

if (loading) {
return (
<footer className="bg-gray-900 text-white">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
<div className="animate-pulse">
<div className="h-8 bg-gray-700 rounded w-48 mb-4"></div>
<div className="h-4 bg-gray-700 rounded w-72 mb-8"></div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
{[...Array(4)].map((_,i)=> (
<div key={i} className="space-y-3">
<div className="h-4 bg-gray-700 rounded w-24"></div>
<div className="h-3 bg-gray-700 rounded w-32"></div>
<div className="h-3 bg-gray-700 rounded w-28"></div>
</div>
))}
</div>
</div>
</div>
</footer>
);
}

if (!companyInfo) {
return null;
}

return (
<footer className="bg-gray-900 text-white">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
{/* Company Info */}
<div className="col-span-1 md:col-span-2">
<div className="flex items-center space-x-2 mb-4">
<div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
<SafeIcon icon={FiHome} className="text-white text-lg" />
</div>
<span className="text-xl font-bold">{companyInfo.name}</span>
{companyInfo.source==='airtable' && (
<div className="flex items-center space-x-1 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
<SafeIcon icon={FiDatabase} className="text-xs" />
<span>Live</span>
</div>
)}
</div>
<p className="text-gray-300 mb-4 max-w-md">
{companyInfo.description}
</p>
<div className="space-y-2">
<div className="flex items-center space-x-2 text-gray-300">
<SafeIcon icon={FiMapPin} className="text-sm flex-shrink-0" />
<span className="text-sm">{companyInfo.fullAddress}</span>
</div>
<div className="flex items-center space-x-2 text-gray-300">
<SafeIcon icon={FiPhone} className="text-sm flex-shrink-0" />
<span className="text-sm">{companyInfo.phone}</span>
</div>
{companyInfo.fax && (
<div className="flex items-center space-x-2 text-gray-300">
<SafeIcon icon={FiFax} className="text-sm flex-shrink-0" />
<span className="text-sm">{companyInfo.fax}</span>
</div>
)}
<div className="flex items-center space-x-2 text-gray-300">
<SafeIcon icon={FiMail} className="text-sm flex-shrink-0" />
<span className="text-sm">{companyInfo.email}</span>
</div>
<div className="flex items-center space-x-2 text-gray-300">
<SafeIcon icon={FiClock} className="text-sm flex-shrink-0" />
<span className="text-sm">{companyInfo.businessHours}</span>
</div>
{companyInfo.closedDays && (
<div className="text-gray-400 text-sm ml-6">
定休日: {companyInfo.closedDays}
</div>
)}
</div>

{/* Social Media Links */}
<div className="mt-6 flex items-center space-x-4">
{companyInfo.website && (
<a
href={companyInfo.website}
target="_blank"
rel="noopener noreferrer"
className="text-gray-400 hover:text-white transition-colors"
title="公式サイト"
>
<SafeIcon icon={FiGlobe} className="text-xl" />
</a>
)}
{companyInfo.twitter && (
<a
href={`https://twitter.com/${companyInfo.twitter.replace('@','')}`}
target="_blank"
rel="noopener noreferrer"
className="text-gray-400 hover:text-blue-400 transition-colors"
title="Twitter"
>
<SafeIcon icon={FiTwitter} className="text-xl" />
</a>
)}
{companyInfo.facebook && (
<a
href={`https://facebook.com/${companyInfo.facebook}`}
target="_blank"
rel="noopener noreferrer"
className="text-gray-400 hover:text-blue-600 transition-colors"
title="Facebook"
>
<SafeIcon icon={FiFacebook} className="text-xl" />
</a>
)}
{companyInfo.instagram && (
<a
href={`https://instagram.com/${companyInfo.instagram}`}
target="_blank"
rel="noopener noreferrer"
className="text-gray-400 hover:text-pink-500 transition-colors"
title="Instagram"
>
<SafeIcon icon={FiInstagram} className="text-xl" />
</a>
)}
{companyInfo.linkedin && (
<a
href={`https://linkedin.com/${companyInfo.linkedin}`}
target="_blank"
rel="noopener noreferrer"
className="text-gray-400 hover:text-blue-700 transition-colors"
title="LinkedIn"
>
<SafeIcon icon={FiLinkedin} className="text-xl" />
</a>
)}
</div>

{/* Website Link */}
{companyInfo.website && (
<div className="mt-4">
<a
href={companyInfo.website}
target="_blank"
rel="noopener noreferrer"
className="inline-flex items-center space-x-1 text-green-400 hover:text-green-300 text-sm font-medium"
>
<span>公式サイト</span>
<SafeIcon icon={FiExternalLink} className="text-xs" />
</a>
</div>
)}
</div>

{/* Quick Links */}
<div>
<h3 className="text-lg font-semibold mb-4">クイックリンク</h3>
<ul className="space-y-2">
<li>
<Link to="/search" className="text-gray-300 hover:text-white transition-colors">
物件検索
</Link>
</li>
<li>
<Link to="/map-search" className="text-gray-300 hover:text-white transition-colors">
地図検索
</Link>
</li>
<li>
<Link to="/about" className="text-gray-300 hover:text-white transition-colors">
会社概要
</Link>
</li>
<li>
<Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
お問い合わせ
</Link>
</li>
<li>
<Link to="/opening-support" className="text-gray-300 hover:text-white transition-colors">
開業サポート
</Link>
</li>
</ul>
</div>

{/* Property Types */}
<div>
<h3 className="text-lg font-semibold mb-4">物件種別</h3>
<ul className="space-y-2">
<li>
<Link to="/search?type=restaurant" className="text-gray-300 hover:text-white transition-colors">
飲食店
</Link>
</li>
<li>
<Link to="/search?type=retail" className="text-gray-300 hover:text-white transition-colors">
小売店
</Link>
</li>
<li>
<Link to="/search?type=office" className="text-gray-300 hover:text-white transition-colors">
オフィス
</Link>
</li>
<li>
<Link to="/search?type=warehouse" className="text-gray-300 hover:text-white transition-colors">
倉庫・工場
</Link>
</li>
<li>
<Link to="/search?type=service" className="text-gray-300 hover:text-white transition-colors">
サービス業
</Link>
</li>
</ul>
</div>
</div>

{/* Branches Section */}
{companyInfo.branches && companyInfo.branches.length > 0 && (
<div className="border-t border-gray-800 mt-8 pt-8">
<h3 className="text-lg font-semibold mb-4">支社・営業所</h3>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{companyInfo.branches.map((branch,index)=> (
<div key={index} className="bg-gray-800 rounded-lg p-4">
<h4 className="font-semibold text-green-400 mb-2">{branch.name}</h4>
<div className="space-y-1 text-sm text-gray-300">
<div className="flex items-center space-x-2">
<SafeIcon icon={FiMapPin} className="text-xs flex-shrink-0" />
<span>{branch.address}</span>
</div>
<div className="flex items-center space-x-2">
<SafeIcon icon={FiPhone} className="text-xs flex-shrink-0" />
<span>{branch.phone}</span>
</div>
{branch.manager && (
<div className="text-gray-400 text-xs mt-2">
責任者: {branch.manager}
</div>
)}
</div>
</div>
))}
</div>
</div>
)}

{/* Copyright */}
<div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
<p className="text-gray-400 text-sm">
&copy;2024 {companyInfo.name}. All rights reserved.
</p>
{companyInfo.source==='airtable' && (
<div className="flex items-center space-x-2 text-xs text-gray-500 mt-2 md:mt-0">
<SafeIcon icon={FiDatabase} className="text-xs" />
<span>会社情報はAirtableから自動取得</span>
<span>•</span>
<span>最終更新: {new Date(companyInfo.lastUpdated).toLocaleDateString('ja-JP')}</span>
{companyInfo.airtableRecordId && (
<>
<span>•</span>
<span>ID: {companyInfo.airtableRecordId.substring(0,8)}...</span>
</>
)}
</div>
)}
</div>
</div>
</footer>
);
};

export default Footer;