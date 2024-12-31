import { useState, useEffect } from 'react';

interface WatchedMovie {
  id: number;
  rating?: number;
  comment?: string;
}

export function useWatched() {
  const [watched, setWatched] = useState<WatchedMovie[]>(() => {
    const saved = localStorage.getItem('watchedMovies');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('watchedMovies', JSON.stringify(watched));
  }, [watched]);

  const toggleWatched = (movieId: number) => {
    setWatched(prev =>
      prev.some(m => m.id === movieId)
        ? prev.filter(m => m.id !== movieId)
        : [...prev, { id: movieId }]
    );
  };

  const updateWatchedMovie = (movieId: number, rating?: number, comment?: string) => {
    setWatched(prev =>
      prev.map(m =>
        m.id === movieId ? { ...m, rating, comment } : m
      )
    );
  };

  return { watched, toggleWatched, updateWatchedMovie };
}
