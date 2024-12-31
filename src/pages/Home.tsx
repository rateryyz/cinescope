import { useEffect } from 'react';
import { motion } from 'framer-motion';
import MovieGrid from '../components/MovieGrid';
import { useMovies } from '../hooks/useMovies';
import { fadeIn, slideUp } from '../components/animations/variants';

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
          <motion.h1 
            variants={slideUp}
            className="text-4xl md:text-5xl font-bold mb-2 text-foreground text-center"
          >
            Discover Movies
          </motion.h1>
          <motion.p 
            variants={slideUp}
            className="text-lg text-muted-foreground text-center mb-12"
          >
            Explore the latest and greatest in cinema
          </motion.p>
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