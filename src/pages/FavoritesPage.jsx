import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import PropertyCard from '../components/PropertyCard';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';

const { FiHeart, FiGrid, FiList, FiTrash2, FiArrowLeft } = FiIcons;

const FavoritesPage = () => {
  const { favorites, clearFavorites } = useFavorites();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('grid');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Convert favorites to property format for PropertyCard
  const favoriteProperties = favorites.map(fav => ({
    ...fav,
    featured: false,
    postedDate: fav.addedAt ? new Date(fav.addedAt).toLocaleDateString('ja-JP') : '不明'
  }));

  const handleClearAll = () => {
    clearFavorites();
    setShowClearConfirm(false);
    
    // Show success message
    const message = document.createElement('div');
    message.textContent = 'すべてのお気に入りを削除しました';
    message.className = 'fixed top-20 right-4 bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm';
    document.body.appendChild(message);
    setTimeout(() => {
      if (document.body.contains(message)) {
        document.body.removeChild(message);
      }
    }, 3000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <SafeIcon icon={FiHeart} className="text-6xl text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              ログインが必要です
            </h1>
            <p className="text-gray-600 mb-8">
              お気に入り物件を表示するにはログインしてください
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} />
              <span>ホームに戻る</span>
            </Link>
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
          <div className="flex items-center space-x-3 mb-4">
            <Link
              to="/"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="text-xl" />
            </Link>
            <SafeIcon icon={FiHeart} className="text-2xl text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">お気に入り物件</h1>
          </div>
          <p className="text-gray-600">
            {favorites.length}件のお気に入り物件があります
          </p>
        </div>

        {favorites.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <SafeIcon icon={FiHeart} className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              お気に入り物件がありません
            </h2>
            <p className="text-gray-600 mb-8">
              気になる物件を見つけたら、ハートマークをクリックしてお気に入りに追加しましょう
            </p>
            <Link
              to="/search"
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} />
              <span>物件を探す</span>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center space-x-4">
                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${
                      viewMode === 'grid'
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <SafeIcon icon={FiGrid} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${
                      viewMode === 'list'
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <SafeIcon icon={FiList} />
                  </button>
                </div>
              </div>

              {favorites.length > 0 && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 text-sm"
                >
                  <SafeIcon icon={FiTrash2} />
                  <span>すべて削除</span>
                </button>
              )}
            </div>

            {/* Properties Grid */}
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {favoriteProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Clear Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                お気に入りをすべて削除
              </h3>
              <p className="text-gray-600 mb-6">
                すべてのお気に入り物件を削除しますか？この操作は取り消せません。
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  削除
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;