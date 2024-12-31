import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MovieGrid from '../components/MovieGrid';
import { useFavorites } from '../hooks/useFavorites';
import { getMovieDetails } from '../services/tmdb';
import { fadeIn, slideUp } from '../components/animations/variants';

export default function Favorites() {
  const { favorites } = useFavorites();
  const [favoriteMovies, setFavoriteMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      try {
        const moviePromises = favorites.map(id => getMovieDetails(id));
        const movies = await Promise.all(moviePromises);
        setFavoriteMovies(movies);
      } catch (error) {
        console.error('Error fetching favorite movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteMovies();
  }, [favorites]);

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
            Your Favorite Movies
          </motion.h1>
          <motion.p 
            variants={slideUp}
            className="text-lg text-muted-foreground text-center mb-12"
          >
            Your personal collection of cinematic gems
          </motion.p>
          <MovieGrid
            movies={favoriteMovies}
            loading={loading}
            hasMore={false}
            onLoadMore={() => {}}
          />
          {!loading && favoriteMovies.length === 0 && (
            <p className="text-center text-muted-foreground">
              You haven't added any favorites yet. Start exploring and add some movies!
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

