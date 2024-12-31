import { useState, useCallback } from 'react';
import { getPopularMovies, searchMovies, Movie, MovieResponse } from '../services/tmdb';

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMovies = useCallback(async (searchQuery?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: MovieResponse = searchQuery 
        ? await searchMovies(searchQuery, page)
        : await getPopularMovies(page);

      setMovies(prev => page === 1 ? response.results : [...prev, ...response.results]);
      setHasMore(response.page < response.total_pages);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  }, [page]);

  const resetMovies = useCallback(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  return {
    movies,
    loading,
    error,
    hasMore,
    loadMovies,
    resetMovies
  };
}