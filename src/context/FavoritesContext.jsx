// FavoritesContext.jsx
import { useState, useEffect } from 'react';
import { FavoritesContext } from './favoritesContext';

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('travelhub-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('travelhub-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (destination) => {
    setFavorites(prev => [...prev, destination]);
  };

  const removeFavorite = (id) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};