import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {useAuth} from '../contexts/AuthContext';
import {useBlog} from '../contexts/BlogContext';
import {useAirtableProperties} from '../hooks/useAirtableProperties';

const {
  FiHome, FiUsers, FiFileText, FiTrendingUp, FiDollarSign, FiMapPin,
  FiPlus, FiEdit, FiTrash2, FiEye, FiCalendar, FiBarChart3,
  FiSettings, FiDatabase, FiRefreshCw, FiDownload, FiUpload,
  FiStar, FiHeart, FiMessageCircle, FiShield, FiActivity,
  FiClock, FiFilter, FiSearch, FiMoreVertical, FiExternalLink
} = FiIcons;

const AdminDashboard = () => {
  const {user, isAdmin} = useAuth();
  const {articles, deleteArticle} = useBlog();
  const {properties, loading, stats, refreshProperties} = useAirtableProperties();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // 管理者チェック
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <SafeIcon icon={FiShield} className="text-6xl text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            アクセス権限がありません
          </h1>
          <p className="text-gray-600 mb-8">
            この機能は管理者のみ利用できます。
          </p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  // 統計データの計算
  const dashboardStats = {
    totalProperties: properties.length,
    totalArticles: articles.length,
    totalViews: articles.reduce((sum, article) => sum + (article.views || 0), 0),
    recentArticles: articles.filter(article => {
      const createdDate = new Date(article.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate >= weekAgo;
    }).length,
    averageRent: stats?.averageRent || 0,
    propertiesWithImages: properties.filter(p => p.images && p.images.length > 0).length
  };

  // 最近の活動
  const recentActivities = [
    ...articles.slice(0, 5).map(article => ({
      type: 'article',
      title: article.title,
      action: '記事を投稿',
      time: article.createdAt,
      id: article.id
    })),
    {
      type: 'property',
      title: 'Airtableデータ同期',
      action: `${properties.length}件の物件データを更新`,
      time: new Date().toISOString(),
      id: 'sync'
    }
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

  const tabs = [
    {id: 'overview', label: 'ダッシュボード', icon: FiHome},
    {id: 'properties', label: '物件管理', icon: FiMapPin},
    {id: 'articles', label: '記事管理', icon: FiFileText},
    {id: 'analytics', label: '分析', icon: FiBarChart3},
    {id: 'settings', label: '設定', icon: FiSettings}
  ];

  const handleDeleteArticle = (articleId) => {
    if (window.confirm('この記事を削除しますか？')) {
      deleteArticle(articleId);
    }
  };

  const StatCard = ({title, value, icon, color = 'blue', change = null}) => (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}% 前月比
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <SafeIcon icon={icon} className={`text-xl text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <SafeIcon icon={FiShield} className="text-purple-600" />
                <span>管理者ダッシュボード</span>
              </h1>
              <p className="text-gray-600 mt-2">
                こんにちは、{user.name}さん。システムの管理と監視を行えます。
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshProperties}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <SafeIcon icon={FiRefreshCw} className={loading ? 'animate-spin' : ''} />
                <span>データ更新</span>
              </button>
              <Link
                to="/admin/article/new"
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <SafeIcon icon={FiPlus} />
                <span>新規記事</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <SafeIcon icon={tab.icon} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="総物件数"
                value={dashboardStats.totalProperties.toLocaleString()}
                icon={FiMapPin}
                color="blue"
                change={5.2}
              />
              <StatCard
                title="総記事数"
                value={dashboardStats.totalArticles.toLocaleString()}
                icon={FiFileText}
                color="green"
                change={12.1}
              />
              <StatCard
                title="総閲覧数"
                value={dashboardStats.totalViews.toLocaleString()}
                icon={FiEye}
                color="purple"
                change={8.7}
              />
              <StatCard
                title="平均賃料"
                value={`¥${dashboardStats.averageRent.toLocaleString()}`}
                icon={FiDollarSign}
                color="orange"
                change={-2.1}
              />
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <SafeIcon icon={FiActivity} className="text-purple-600" />
                  <span>クイックアクション</span>
                </h3>
                <div className="space-y-3">
                  <Link
                    to="/admin/article/new"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <SafeIcon icon={FiPlus} className="text-green-600" />
                    <span className="font-medium">新規記事作成</span>
                  </Link>
                  <button
                    onClick={refreshProperties}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
                  >
                    <SafeIcon icon={FiDatabase} className="text-blue-600" />
                    <span className="font-medium">物件データ同期</span>
                  </button>
                  <Link
                    to="/analytics"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <SafeIcon icon={FiBarChart3} className="text-purple-600" />
                    <span className="font-medium">分析レポート</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <SafeIcon icon={FiSettings} className="text-gray-600" />
                    <span className="font-medium">システム設定</span>
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <SafeIcon icon={FiClock} className="text-blue-600" />
                  <span>最近のアクティビティ</span>
                </h3>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'article' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <SafeIcon 
                          icon={activity.type === 'article' ? FiFileText : FiDatabase} 
                          className={`text-sm ${
                            activity.type === 'article' ? 'text-green-600' : 'text-blue-600'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {activity.title}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(activity.time).toLocaleDateString('ja-JP', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <SafeIcon icon={FiDatabase} className="text-green-600" />
                <span>システム状況</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <SafeIcon icon={FiDatabase} className="text-green-600 text-xl" />
                  </div>
                  <h4 className="font-medium text-gray-900">Airtable接続</h4>
                  <p className="text-sm text-green-600">正常</p>
                  <p className="text-xs text-gray-500">{properties.length}件の物件データ</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <SafeIcon icon={FiShield} className="text-blue-600 text-xl" />
                  </div>
                  <h4 className="font-medium text-gray-900">認証システム</h4>
                  <p className="text-sm text-blue-600">正常</p>
                  <p className="text-xs text-gray-500">Supabase連携済み</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <SafeIcon icon={FiActivity} className="text-purple-600 text-xl" />
                  </div>
                  <h4 className="font-medium text-gray-900">システム稼働</h4>
                  <p className="text-sm text-purple-600">良好</p>
                  <p className="text-xs text-gray-500">99.9% uptime</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="space-y-6">
            {/* Properties Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">物件管理</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={refreshProperties}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <SafeIcon icon={FiRefreshCw} className={loading ? 'animate-spin' : ''} />
                  <span>同期</span>
                </button>
                <Link
                  to="/list-property"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <SafeIcon icon={FiPlus} />
                  <span>物件追加</span>
                </Link>
              </div>
            </div>

            {/* Properties Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiMapPin} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">総物件数</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiEye} className="text-green-600" />
                  <span className="text-sm font-medium text-gray-600">画像あり</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.propertiesWithImages}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiMapPin} className="text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">座標あり</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {properties.filter(p => p.coordinates).length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiDollarSign} className="text-orange-600" />
                  <span className="text-sm font-medium text-gray-600">平均賃料</span>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  ¥{dashboardStats.averageRent.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Properties Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">物件一覧</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="物件を検索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        物件
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        種別
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        賃料
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        エリア
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状態
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {properties
                      .filter(property => 
                        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        property.address.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .slice(0, 10)
                      .map((property) => (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {property.images && property.images.length > 0 ? (
                                <img 
                                  src={property.images[0]} 
                                  alt={property.title}
                                  className="h-10 w-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <SafeIcon icon={FiMapPin} className="text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                {property.title}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {property.address}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {property.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {property.rent ? `¥${property.rent.toLocaleString()}` : '応談'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {property.ward || property.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            property.coordinates 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {property.coordinates ? '完全' : '要確認'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/property/${property.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <SafeIcon icon={FiEye} />
                            </Link>
                            <Link
                              to={`/property/${property.id}`}
                              className="text-green-600 hover:text-green-900"
                            >
                              <SafeIcon icon={FiExternalLink} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="space-y-6">
            {/* Articles Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">記事管理</h2>
              <Link
                to="/admin/article/new"
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <SafeIcon icon={FiPlus} />
                <span>新規記事</span>
              </Link>
            </div>

            {/* Articles Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiFileText} className="text-green-600" />
                  <span className="text-sm font-medium text-gray-600">総記事数</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiEye} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">総閲覧数</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalViews}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiTrendingUp} className="text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">今週の投稿</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.recentArticles}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiStar} className="text-orange-600" />
                  <span className="text-sm font-medium text-gray-600">注目記事</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {articles.filter(a => a.featured).length}
                </p>
              </div>
            </div>

            {/* Articles Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">記事一覧</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        記事
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        カテゴリ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        閲覧数
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        作成日
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {articles.slice(0, 10).map((article) => (
                      <tr key={article.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                src={article.image} 
                                alt={article.title}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                {article.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {article.author}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            {article.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {article.views || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(article.createdAt).toLocaleDateString('ja-JP')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/admin/article/edit/${article.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <SafeIcon icon={FiEdit} />
                            </Link>
                            <button
                              onClick={() => handleDeleteArticle(article.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <SafeIcon icon={FiTrash2} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">分析ダッシュボード</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 物件タイプ別分布 */}
              <div className="bg-white rounded-lg shadow-sm p-6 border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">物件タイプ別分布</h3>
                <div className="space-y-3">
                  {stats?.byType && Object.entries(stats.byType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{type}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{width: `${(count / properties.length) * 100}%`}}
                          />
                        </div>
                        <span className="text-sm text-gray-500">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 記事カテゴリ別分布 */}
              <div className="bg-white rounded-lg shadow-sm p-6 border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">記事カテゴリ別分布</h3>
                <div className="space-y-3">
                  {['trend', 'success', 'market', 'technology'].map((category) => {
                    const count = articles.filter(a => a.category === category).length;
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{category}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{width: `${(count / Math.max(articles.length, 1)) * 100}%`}}
                            />
                          </div>
                          <span className="text-sm text-gray-500">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">システム設定</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* データ同期設定 */}
              <div className="bg-white rounded-lg shadow-sm p-6 border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">データ同期設定</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">自動同期</p>
                      <p className="text-sm text-gray-500">Airtableデータの自動同期を有効化</p>
                    </div>
                    <button className="relative inline-flex items-center h-6 rounded-full w-11 bg-green-600">
                      <span className="translate-x-6 inline-block w-4 h-4 transform bg-white rounded-full transition" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">同期間隔</p>
                      <p className="text-sm text-gray-500">データ同期の実行間隔</p>
                    </div>
                    <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                      <option>30分</option>
                      <option>1時間</option>
                      <option>6時間</option>
                      <option>24時間</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 通知設定 */}
              <div className="bg-white rounded-lg shadow-sm p-6 border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">通知設定</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">メール通知</p>
                      <p className="text-sm text-gray-500">重要な更新をメールで通知</p>
                    </div>
                    <button className="relative inline-flex items-center h-6 rounded-full w-11 bg-green-600">
                      <span className="translate-x-6 inline-block w-4 h-4 transform bg-white rounded-full transition" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">エラー通知</p>
                      <p className="text-sm text-gray-500">システムエラーの即座通知</p>
                    </div>
                    <button className="relative inline-flex items-center h-6 rounded-full w-11 bg-green-600">
                      <span className="translate-x-6 inline-block w-4 h-4 transform bg-white rounded-full transition" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;