import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import SearchForm from '../components/SearchForm';
import PropertyCard from '../components/PropertyCard';
import AirtableDebugPanel from '../components/AirtableDebugPanel';
import { useAirtableProperties } from '../hooks/useAirtableProperties';

const { FiSearch, FiTrendingUp, FiUsers, FiShield, FiArrowRight, FiMapPin, FiNavigation, FiPlus, FiMessageCircle, FiMap, FiTool, FiBookOpen, FiLink, FiFileText, FiDatabase, FiAlertCircle } = FiIcons;

const HomePage = () => {
  const { properties, loading, error, stats, connectionStatus } = useAirtableProperties();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (properties.length > 0) {
      const featured = properties
        .filter(p => p.featured || p.coordinates)
        .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
        .slice(0, 6);
      setFeaturedProperties(featured);
    }
  }, [properties]);

  const handleNavigation = (path) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('❌ Navigation error:', error);
      window.location.href = path;
    }
  };

  const storeInfoSections = [
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
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AirtableDebugPanel properties={properties} stats={stats} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&h=1080&fit=crop')" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/80 via-indigo-700/70 to-purple-600/80" />
        <div className="absolute top-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-blue-300/20 rounded-full blur-lg" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className={`flex items-center space-x-2 backdrop-blur-sm rounded-full px-4 py-2 ${
                connectionStatus === 'connected' 
                  ? 'bg-green-500/20 border border-green-300/30' 
                  : connectionStatus === 'error' 
                  ? 'bg-red-500/20 border border-red-300/30' 
                  : 'bg-white/20 border border-white/30'
              }`}>
                <SafeIcon icon={FiDatabase} className={
                  connectionStatus === 'connected' 
                    ? 'text-green-200' 
                    : connectionStatus === 'error' 
                    ? 'text-red-200' 
                    : 'text-blue-200'
                } />
                <span className={`text-sm font-medium ${
                  connectionStatus === 'connected' 
                    ? 'text-green-100' 
                    : connectionStatus === 'error' 
                    ? 'text-red-100' 
                    : 'text-blue-100'
                }`}>
                  Airtable {connectionStatus === 'connected' ? '接続中' : connectionStatus === 'error' ? 'エラー' : '接続中...'}
                </span>
              </div>
              {loading && (
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-white text-sm">データ読み込み中...</span>
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              東京都内の
              <br />
              <span className="text-blue-200">理想の店舗物件</span>を見つけよう
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Airtableリアルタイムデータで最新物件情報をお届け。23区から多摩地域まで全域対応
            </p>

            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">{stats.total}</div>
                  <div className="text-blue-100 text-sm">総物件数</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">{(stats.averageRent / 10000).toFixed(0)}万</div>
                  <div className="text-blue-100 text-sm">平均賃料/月</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">{stats.averageArea}</div>
                  <div className="text-blue-100 text-sm">平均面積㎡</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">{stats.withCoordinates}</div>
                  <div className="text-blue-100 text-sm">地図対応物件</div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={() => handleNavigation('/search')}
                className="inline-flex items-center justify-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <SafeIcon icon={FiSearch} />
                <span>物件を検索する</span>
              </button>
              <button
                type="button"
                onClick={() => handleNavigation('/map-search')}
                className="inline-flex items-center justify-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                <SafeIcon icon={FiMap} />
                <span>地図から検索</span>
              </button>
              <button
                type="button"
                onClick={() => handleNavigation('/list-property')}
                className="inline-flex items-center justify-center space-x-2 border-2 border-blue-300 text-blue-200 px-8 py-4 rounded-lg font-semibold hover:bg-blue-300 hover:text-blue-800 transition-all duration-300 transform hover:scale-105"
              >
                <SafeIcon icon={FiPlus} />
                <span>物件を掲載する</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <SearchForm />
          </motion.div>
        </div>
      </section>

      {/* Featured Properties Section */}
      {featuredProperties.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">注目の物件</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-8">
                <button
                  onClick={() => handleNavigation('/search')}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">店舗開業サポート</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {storeInfoSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleNavigation(section.link)}
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