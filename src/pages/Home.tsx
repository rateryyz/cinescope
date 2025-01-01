import { useEffect } from 'react';
import { motion } from 'framer-motion';
import MovieGrid from '../components/MovieGrid';
import RandomMovie from '../components/RandomMovie';
import { useMovies } from '../hooks/useMovies';
import { fadeIn } from '../components/animations/variants';

export default function Home() {
  const { movies, loading, error, hasMore, loadMovies } = useMovies();

  useEffect(() => {
    loadMovies();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

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
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
            <RandomMovie />
          </div>
          <MovieGrid
            movies={movies}
            onLoadMore={() => loadMovies()}
            hasMore={hasMore}
            loading={loading}
          />
        </div>
      </div>
    </motion.div>
  );
}