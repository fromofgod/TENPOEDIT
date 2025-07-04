import React, { createContext, useContext, useState, useEffect } from 'react';

const BlogContext = createContext();

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

export const BlogProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  // LocalStorageからブログ記事を読み込み
  useEffect(() => {
    const savedArticles = localStorage.getItem('blog_articles');
    if (savedArticles) {
      try {
        setArticles(JSON.parse(savedArticles));
      } catch (error) {
        console.error('Error parsing saved articles:', error);
      }
    }
  }, []);

  // 記事をLocalStorageに保存
  const saveArticles = (newArticles) => {
    localStorage.setItem('blog_articles', JSON.stringify(newArticles));
    setArticles(newArticles);
  };

  // 新しい記事を追加
  const addArticle = (articleData) => {
    const newArticle = {
      id: Date.now(),
      ...articleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0
    };
    
    const updatedArticles = [newArticle, ...articles];
    saveArticles(updatedArticles);
    return newArticle;
  };

  // 記事を更新
  const updateArticle = (id, updates) => {
    const updatedArticles = articles.map(article => 
      article.id === id 
        ? { ...article, ...updates, updatedAt: new Date().toISOString() }
        : article
    );
    saveArticles(updatedArticles);
  };

  // 記事を削除
  const deleteArticle = (id) => {
    const updatedArticles = articles.filter(article => article.id !== id);
    saveArticles(updatedArticles);
  };

  // 記事を取得（ID指定）
  const getArticle = (id) => {
    return articles.find(article => article.id === parseInt(id));
  };

  // 記事の閲覧数を増加
  const incrementViews = (id) => {
    const updatedArticles = articles.map(article => 
      article.id === parseInt(id) 
        ? { ...article, views: (article.views || 0) + 1 }
        : article
    );
    saveArticles(updatedArticles);
  };

  // カテゴリ別記事取得
  const getArticlesByCategory = (category) => {
    if (category === 'all') return articles;
    return articles.filter(article => article.category === category);
  };

  // 最新記事取得
  const getLatestArticles = (limit = 5) => {
    return articles
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  };

  // 人気記事取得
  const getPopularArticles = (limit = 5) => {
    return articles
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit);
  };

  const value = {
    articles,
    loading,
    addArticle,
    updateArticle,
    deleteArticle,
    getArticle,
    incrementViews,
    getArticlesByCategory,
    getLatestArticles,
    getPopularArticles
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};