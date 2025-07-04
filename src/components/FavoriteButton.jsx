import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';

const { FiHeart } = FiIcons;

const FavoriteButton = ({ property, className = '', size = 'normal' }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isPropertyFavorited = isFavorite(property.id);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert('お気に入りに追加するにはログインが必要です');
      return;
    }

    setIsAnimating(true);
    const result = toggleFavorite(property);
    
    // Show feedback message
    if (result) {
      // Added to favorites
      const message = document.createElement('div');
      message.textContent = 'お気に入りに追加しました！';
      message.className = 'fixed top-20 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm';
      document.body.appendChild(message);
      setTimeout(() => {
        if (document.body.contains(message)) {
          document.body.removeChild(message);
        }
      }, 3000);
    } else if (result === false && isPropertyFavorited) {
      // Removed from favorites
      const message = document.createElement('div');
      message.textContent = 'お気に入りから削除しました';
      message.className = 'fixed top-20 right-4 bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm';
      document.body.appendChild(message);
      setTimeout(() => {
        if (document.body.contains(message)) {
          document.body.removeChild(message);
        }
      }, 3000);
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    normal: 'w-10 h-10 text-base',
    large: 'w-12 h-12 text-lg'
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]}
        ${isPropertyFavorited 
          ? 'bg-red-100 text-red-600 border-red-200' 
          : 'bg-white text-gray-400 border-gray-200'
        }
        border-2 rounded-full flex items-center justify-center
        hover:scale-110 transition-all duration-200 shadow-sm
        ${className}
      `}
      whileTap={{ scale: 0.9 }}
      animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
      title={isPropertyFavorited ? 'お気に入りから削除' : 'お気に入りに追加'}
    >
      <SafeIcon 
        icon={FiHeart} 
        className={isPropertyFavorited ? 'fill-current' : ''} 
      />
    </motion.button>
  );
};

export default FavoriteButton;