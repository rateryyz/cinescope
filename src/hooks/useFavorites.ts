import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('movieFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (movieId: number) => {
    setFavorites(prev =>
      prev.includes(movieId)
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
  };

  return { favorites, toggleFavorite };
}