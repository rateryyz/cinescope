import { motion } from "framer-motion";
import MovieCard from "./MovieCard";
import { staggerContainer } from "./animations/variants";
import { useFavorites } from "../hooks/useFavorites";

interface Movie {
  id: number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  release_date?: string;
}

interface MovieGridProps {
  movies: Movie[] | null;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

export default function MovieGrid({
  movies,
  onLoadMore,
  hasMore,
  loading,
}: MovieGridProps) {
  const { favorites, toggleFavorite } = useFavorites();

  if (loading && (!movies || movies.length === 0)) {
    return <p className="text-center text-muted-foreground">Loading...</p>;
  }

  if (!loading && (!movies || movies.length === 0)) {
    return (
      <p className="text-center text-muted-foreground">No movies found.</p>
    );
  }

  return (
    <div>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 mb-12"
      >
        {movies &&
          movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={favorites.includes(movie.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
      </motion.div>

      {hasMore && (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLoadMore}
            disabled={loading}
            className="px-6 sm:px-8 py-2 sm:py-3 bg-primary text-primary-foreground rounded-lg shadow-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:hover:brightness-100 text-sm sm:text-base"
          >
            {loading ? "Loading..." : "Load More"}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
