import { motion } from 'framer-motion';
import { Shuffle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomMovie } from '../services/tmdb';
import { useFavorites } from '../hooks/useFavorites';
import { useWatched } from '../hooks/useWatched';

export default function RandomMovie() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { watched } = useWatched();

  const handleRandomMovie = async () => {
    try {
      setLoading(true);
      const highlyRatedWatched = watched.filter((m): m is { id: number; rating: number } => m.rating !== undefined && m.rating >= 4);
      const recommendedMovie = await getRandomMovie(favorites, highlyRatedWatched);
      navigate(`/movie/${recommendedMovie.id}`);
    } catch (error) {
      console.error('Error getting random movie:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleRandomMovie}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg shadow-md hover:brightness-110 transition-all disabled:opacity-50"
    >
      <Shuffle className="w-4 h-4" />
      <span>{loading ? 'Loading...' : 'Random Movie'}</span>
    </motion.button>
  );
}

