import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiFileText, FiCalendar, FiUser, FiTag, FiClock, FiTrendingUp, FiArrowRight } = FiIcons;

const RealEstateBlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'すべて' },
    { id: 'tips', name: '物件選びのコツ' },
    { id: 'market', name: '市場分析' },
    { id: 'contract', name: '契約・法務' },
    { id: 'location', name: '立地分析' },
    { id: 'investment', name: '投資・収益' }
  ];

  // 英語のサンプルデータを削除し、空の配列に変更
  const blogPosts = [];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getCategoryColor = (categoryId) => {
    const colors = {
      tips: 'bg-blue-100 text-blue-800',
      market: 'bg-green-100 text-green-800',
      contract: 'bg-red-100 text-red-800',
      location: 'bg-purple-100 text-purple-800',
      investment: 'bg-orange-100 text-orange-800'
    };
    return colors[categoryId] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              不動産ブログ
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
              物件選びのコツから市場分析まで、不動産のプロが教える実践的な情報
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Articles */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">記事一覧</h2>
            
            {/* Empty State */}
            <div className="text-center py-12">
              <SafeIcon icon={FiFileText} className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                記事がまだありません
              </h3>
              <p className="text-gray-600 mb-6">
                不動産に関する記事がここに表示されます。
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              不動産情報を定期配信
            </h2>
            <p className="text-xl mb-8 text-orange-100">
              市場動向や投資のヒントを月2回お届けします
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto">
              <input
                type="email"
                placeholder="メールアドレスを入力"
                className="flex-1 px-4 py-3 text-gray-900 rounded-l-md sm:rounded-r-none rounded-r-md focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button className="bg-orange-800 text-white px-6 py-3 rounded-r-md sm:rounded-l-none rounded-l-md hover:bg-orange-700 transition-colors">
                登録
              </button>
            </div>
            <p className="text-sm text-orange-200 mt-4">
              いつでも配信停止できます。プライバシーポリシーに同意の上ご登録ください。
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default RealEstateBlogPage;