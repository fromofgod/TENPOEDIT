import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useBlog } from '../contexts/BlogContext';
import { useAuth } from '../contexts/AuthContext';

const { FiTrendingUp, FiCalendar, FiTag, FiEye, FiArrowRight, FiPlus, FiEdit, FiTrash2 } = FiIcons;

const RestaurantNewsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { articles, deleteArticle, incrementViews, getArticlesByCategory } = useBlog();
  const { isAdmin } = useAuth();

  const categories = [
    { id: 'all', name: 'すべて' },
    { id: 'trend', name: 'トレンド' },
    { id: 'success', name: '成功事例' },
    { id: 'market', name: '市場動向' },
    { id: 'technology', name: 'テクノロジー' },
    { id: 'regulation', name: '法規制' },
    { id: 'news', name: 'ニュース' }
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : articles.filter(article => article.category === selectedCategory)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const featuredArticle = filteredArticles.find(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getCategoryColor = (categoryId) => {
    const colors = {
      trend: 'bg-green-100 text-green-800',
      success: 'bg-blue-100 text-blue-800',
      market: 'bg-purple-100 text-purple-800',
      technology: 'bg-orange-100 text-orange-800',
      regulation: 'bg-red-100 text-red-800',
      news: 'bg-indigo-100 text-indigo-800'
    };
    return colors[categoryId] || 'bg-gray-100 text-gray-800';
  };

  const handleDeleteArticle = (articleId) => {
    if (window.confirm('この記事を削除しますか？')) {
      deleteArticle(articleId);
    }
  };

  const handleViewArticle = (articleId) => {
    incrementViews(articleId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-4 mb-6">
              <h1 className="text-4xl md:text-5xl font-bold">
                飲食店最新ニュース
              </h1>
              {isAdmin && (
                <Link
                  to="/admin/article/new"
                  className="flex items-center space-x-2 bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors font-medium"
                >
                  <SafeIcon icon={FiPlus} />
                  <span>新規投稿</span>
                </Link>
              )}
            </div>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
              業界のトレンド、成功事例、市場動向など飲食業界の最新情報をお届け
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
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && selectedCategory === 'all' && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">注目記事</h2>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg overflow-hidden shadow-lg">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(featuredArticle.category)}`}>
                          {getCategoryName(featuredArticle.category)}
                        </span>
                        <span className="text-sm text-gray-500">注目記事</span>
                      </div>
                      {isAdmin && featuredArticle.id > 100 && (
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/admin/article/edit/${featuredArticle.id}`}
                            className="p-1 text-blue-600 hover:text-blue-700"
                          >
                            <SafeIcon icon={FiEdit} className="text-sm" />
                          </Link>
                          <button
                            onClick={() => handleDeleteArticle(featuredArticle.id)}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <SafeIcon icon={FiTrash2} className="text-sm" />
                          </button>
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {featuredArticle.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {featuredArticle.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiCalendar} />
                          <span>{new Date(featuredArticle.createdAt).toLocaleDateString('ja-JP')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiEye} />
                          <span>{featuredArticle.views || 0}回閲覧</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewArticle(featuredArticle.id)}
                        className="inline-flex items-center space-x-1 text-green-600 hover:text-green-700 font-medium"
                      >
                        <span>続きを読む</span>
                        <SafeIcon icon={FiArrowRight} />
                      </button>
                    </div>
                  </div>
                  <div className="lg:order-first">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* News Articles */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">最新ニュース</h2>
            {regularArticles.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  記事がまだありません
                </h3>
                <p className="text-gray-600 mb-6">
                  管理者によって投稿された記事がここに表示されます。
                </p>
                {isAdmin && (
                  <Link
                    to="/admin/article/new"
                    className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <SafeIcon icon={FiPlus} />
                    <span>最初の記事を投稿</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularArticles.map((article, index) => (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(article.category)}`}>
                          {getCategoryName(article.category)}
                        </span>
                        {isAdmin && article.id > 100 && (
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/admin/article/edit/${article.id}`}
                              className="p-1 text-blue-600 hover:text-blue-700"
                            >
                              <SafeIcon icon={FiEdit} className="text-sm" />
                            </Link>
                            <button
                              onClick={() => handleDeleteArticle(article.id)}
                              className="p-1 text-red-600 hover:text-red-700"
                            >
                              <SafeIcon icon={FiTrash2} className="text-sm" />
                            </button>
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {article.summary}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <SafeIcon icon={FiCalendar} />
                            <span>{new Date(article.createdAt).toLocaleDateString('ja-JP')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <SafeIcon icon={FiEye} />
                            <span>{article.views || 0}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {article.authorPicture && (
                            <img
                              src={article.authorPicture}
                              alt={article.author}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <span className="text-xs text-gray-600">{article.author}</span>
                        </div>
                        <button
                          onClick={() => handleViewArticle(article.id)}
                          className="text-green-600 hover:text-green-700 font-medium text-sm"
                        >
                          続きを読む
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              最新情報をメールで受け取る
            </h2>
            <p className="text-xl mb-8 text-green-100">
              飲食業界の最新トレンドや成功事例を週1回お届けします
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto">
              <input
                type="email"
                placeholder="メールアドレスを入力"
                className="flex-1 px-4 py-3 text-gray-900 rounded-l-md sm:rounded-r-none rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button className="bg-green-800 text-white px-6 py-3 rounded-r-md sm:rounded-l-none rounded-l-md hover:bg-green-700 transition-colors">
                登録
              </button>
            </div>
            <p className="text-sm text-green-200 mt-4">
              いつでも配信停止できます。プライバシーポリシーに同意の上ご登録ください。
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default RestaurantNewsPage;