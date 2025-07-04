import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch (error) {
          console.error('Error parsing favorites:', error);
          setFavorites([]);
        }
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  // Save favorites to localStorage when favorites change
  useEffect(() => {
    if (user && favorites.length >= 0) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  const addToFavorites = (property) => {
    if (!user) {
      alert('お気に入りに追加するにはログインが必要です');
      return false;
    }

    if (!isFavorite(property.id)) {
      const favoriteItem = {
        id: property.id,
        title: property.title,
        type: property.type,
        location: property.location,
        ward: property.ward,
        nearestStation: property.nearestStation,
        rent: property.rent,
        area: property.area,
        images: property.images,
        addedAt: new Date().toISOString()
      };
      setFavorites(prev => [...prev, favoriteItem]);
      return true;
    }
    return false;
  };

  const removeFromFavorites = (propertyId) => {
    setFavorites(prev => prev.filter(item => item.id !== propertyId));
  };

  const toggleFavorite = (property) => {
    if (isFavorite(property.id)) {
      removeFromFavorites(property.id);
      return false;
    } else {
      return addToFavorites(property);
    }
  };

  const isFavorite = (propertyId) => {
    return favorites.some(item => item.id === propertyId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};