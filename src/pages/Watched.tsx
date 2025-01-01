import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWatched } from '../hooks/useWatched';
import { getMovieDetails } from '../services/tmdb';
import MovieGrid from '../components/MovieGrid';
import { fadeIn, slideUp } from '../components/animations/variants';

export default function Watched() {
  const { watched } = useWatched();
  const [watchedMovies, setWatchedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      try {
        const moviePromises = watched.map(w => getMovieDetails(w.id));
        const movies = await Promise.all(moviePromises);
        setWatchedMovies(movies.map((movie, index) => ({
          ...movie,
          userRating: watched[index].rating,
          userComment: watched[index].comment
        })));
      } catch (error) {
        console.error('Error fetching watched movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchedMovies();
  }, [watched]);

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
            Watched Movies
          </motion.h1>
          <motion.p 
            variants={slideUp}
            className="text-lg text-muted-foreground text-center mb-12"
          >
            Your personal collection of watched films
          </motion.p>
          <MovieGrid
            movies={watchedMovies}
            loading={loading}
            hasMore={false}
            onLoadMore={() => {}}
          />
          {!loading && watchedMovies.length === 0 && (
            <p className="text-center text-muted-foreground">
              You haven't marked any movies as watched yet. Start exploring and add some movies!
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
