import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import MovieGrid from '../components/MovieGrid';
import { searchMovies, Movie, MovieResponse } from '../services/tmdb';
import { fadeIn, slideUp } from '../components/animations/variants';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const results: MovieResponse = await searchMovies(query, page);
        setMovies(prevMovies => page === 1 ? results.results : [...prevMovies, ...results.results]);
        setHasMore(results.page < results.total_pages);
      } catch (err) {
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query, page]);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <motion.div 
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen relative bg-background"
    >
      <div className="relative z-10 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.h1 
            variants={slideUp}
            className="text-4xl md:text-5xl font-bold mb-2 text-foreground text-center"
          >
            Search Results
          </motion.h1>
          {query && (
            <motion.p 
              variants={slideUp}
              className="text-lg text-muted-foreground text-center mb-12"
            >
              Showing results for "{query}"
            </motion.p>
          )}
          {error && (
            <p className="text-center text-red-500 mb-8">{error}</p>
          )}
          <MovieGrid
            movies={movies}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
          />
        </div>
      </div>
    </motion.div>
  );
}

