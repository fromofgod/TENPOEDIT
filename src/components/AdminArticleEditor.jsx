import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useBlog } from '../contexts/BlogContext';
import { useAuth } from '../contexts/AuthContext';

const { FiSave, FiX, FiEye, FiImage, FiCalendar, FiTag, FiFileText } = FiIcons;

const AdminArticleEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const { addArticle, updateArticle, getArticle } = useBlog();
  
  const [isEditing, setIsEditing] = useState(!!id);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'trend',
    featured: false,
    image: '',
    tags: []
  });
  
  const [newTag, setNewTag] = useState('');

  const categories = [
    { id: 'trend', name: 'トレンド' },
    { id: 'success', name: '成功事例' },
    { id: 'market', name: '市場動向' },
    { id: 'technology', name: 'テクノロジー' },
    { id: 'regulation', name: '法規制' },
    { id: 'tips', name: '物件選びのコツ' },
    { id: 'location', name: '立地分析' },
    { id: 'investment', name: '投資・収益' },
    { id: 'contract', name: '契約・法務' },
    { id: 'news', name: 'ニュース' }
  ];

  useEffect(() => {
    // 管理者チェック
    if (!isAdmin) {
      navigate('/');
      return;
    }

    // 編集モードの場合、既存記事を読み込み
    if (isEditing && id) {
      const article = getArticle(parseInt(id));
      if (article) {
        setFormData({
          title: article.title,
          summary: article.summary,
          content: article.content,
          category: article.category,
          featured: article.featured || false,
          image: article.image || '',
          tags: article.tags || []
        });
      }
    }
  }, [id, isEditing, isAdmin, navigate, getArticle]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const articleData = {
        ...formData,
        author: user.name,
        authorEmail: user.email,
        authorPicture: user.picture
      };

      if (isEditing) {
        updateArticle(parseInt(id), articleData);
        alert('記事を更新しました！');
      } else {
        addArticle(articleData);
        alert('記事を投稿しました！');
      }

      navigate('/restaurant-news');
    } catch (error) {
      console.error('Error saving article:', error);
      alert('記事の保存に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            アクセス権限がありません
          </h1>
          <p className="text-gray-600 mb-8">
            この機能は管理者のみ利用できます。
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? '記事を編集' : '新しい記事を作成'}
              </h1>
              <p className="text-gray-600 mt-2">
                管理者として記事を{isEditing ? '編集' : '投稿'}できます
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SafeIcon icon={FiEye} />
                <span>{showPreview ? 'エディター' : 'プレビュー'}</span>
              </button>
              <button
                onClick={() => navigate('/restaurant-news')}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SafeIcon icon={FiX} />
                <span>キャンセル</span>
              </button>
            </div>
          </div>
        </div>

        {showPreview ? (
          /* Preview Mode */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800`}>
                  {getCategoryName(formData.category)}
                </span>
                {formData.featured && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    注目記事
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {formData.title || 'タイトルを入力してください'}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{user.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiCalendar} />
                  <span>{new Date().toLocaleDateString('ja-JP')}</span>
                </div>
              </div>
            </div>

            {formData.image && (
              <img
                src={formData.image}
                alt={formData.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}

            <div className="prose max-w-none mb-6">
              <p className="text-lg text-gray-600 leading-relaxed">
                {formData.summary || 'サマリーを入力してください'}
              </p>
              <div className="mt-6 whitespace-pre-wrap text-gray-700 leading-relaxed">
                {formData.content || 'コンテンツを入力してください'}
              </div>
            </div>

            {formData.tags.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">タグ</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* Editor Mode */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    記事タイトル *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="魅力的なタイトルを入力してください"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    カテゴリー *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">注目記事</span>
                  </label>
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メイン画像URL
                </label>
                <div className="flex space-x-2">
                  <SafeIcon icon={FiImage} className="text-gray-400 mt-3" />
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                {formData.image && (
                  <div className="mt-4">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  記事サマリー *
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="記事の要約を入力してください（150文字程度）"
                />
                <p className="mt-1 text-sm text-gray-500">
                  {formData.summary.length}/150文字
                </p>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  記事本文 *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={15}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="記事の本文を入力してください。改行は自動で反映されます。"
                />
                <p className="mt-1 text-sm text-gray-500">
                  {formData.content.length}文字
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  タグ
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="タグを入力してEnter"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    追加
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <SafeIcon icon={FiX} className="text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => navigate('/restaurant-news')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <SafeIcon icon={FiSave} />
                  <span>
                    {loading ? '保存中...' : isEditing ? '記事を更新' : '記事を投稿'}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminArticleEditor;