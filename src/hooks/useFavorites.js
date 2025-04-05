// useFavorites.js
import { useContext } from 'react';
import { FavoritesContext } from '../context/favoritesContext';

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
  }
  return context;
};