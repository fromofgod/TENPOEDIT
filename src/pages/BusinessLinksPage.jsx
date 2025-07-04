import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiLink, FiTool, FiZap, FiPalette, FiTruck, FiClipboard, FiStar, FiPhone, FiMail, FiMapPin, FiExternalLink } = FiIcons;

const BusinessLinksPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'すべて', icon: FiLink },
    { id: 'interior', name: '内装・建築', icon: FiTool },
    { id: 'equipment', name: '設備・機器', icon: FiZap },
    { id: 'design', name: 'デザイン', icon: FiPalette },
    { id: 'delivery', name: '配送・物流', icon: FiTruck },
    { id: 'consulting', name: 'コンサル', icon: FiClipboard }
  ];

  // 英語のサンプルデータを削除し、空の配列に変更
  const businessPartners = [];

  const filteredPartners = selectedCategory === 'all' 
    ? businessPartners 
    : businessPartners.filter(partner => partner.category === selectedCategory);

  const featuredPartners = businessPartners.filter(partner => partner.featured);

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getCategoryColor = (categoryId) => {
    const colors = {
      interior: 'bg-blue-100 text-blue-800',
      equipment: 'bg-green-100 text-green-800',
      design: 'bg-purple-100 text-purple-800',
      delivery: 'bg-orange-100 text-orange-800',
      consulting: 'bg-red-100 text-red-800'
    };
    return colors[categoryId] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              業者リンク
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
              信頼できるパートナー企業をご紹介。内装から設備まで店舗開業をトータルサポート
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <SafeIcon icon={category.icon} className="text-sm" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Business Partners */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">パートナー企業一覧</h2>
            
            {/* Empty State */}
            <div className="text-center py-12">
              <SafeIcon icon={FiLink} className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                パートナー企業がまだありません
              </h3>
              <p className="text-gray-600 mb-6">
                信頼できる業者様の情報がここに表示されます。
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partnership Inquiry */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              パートナー企業募集中
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              信頼できる業者様のご登録をお待ちしております
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white bg-opacity-10 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">登録メリット</h3>
                <ul className="text-left space-y-2 text-purple-100">
                  <li>• 新規顧客の獲得機会</li>
                  <li>• 信頼性の向上</li>
                  <li>• 無料での業者情報掲載</li>
                  <li>• 専門分野での露出増加</li>
                </ul>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">登録条件</h3>
                <ul className="text-left space-y-2 text-purple-100">
                  <li>• 業界での実績3年以上</li>
                  <li>• 適切な許可・資格の取得</li>
                  <li>• お客様満足度の高いサービス</li>
                  <li>• 迅速な対応体制</li>
                </ul>
              </div>
            </div>
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              パートナー登録のお申し込み
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BusinessLinksPage;