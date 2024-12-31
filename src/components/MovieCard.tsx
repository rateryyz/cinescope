import { motion } from 'framer-motion';
import { Heart, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { scaleUp } from './animations/variants';

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
  };
  isFavorite: boolean;
  isWatched: boolean;
  onToggleFavorite: (movieId: number) => void;
  onToggleWatched: (movieId: number) => void;
}

export default function MovieCard({ movie, isFavorite, isWatched, onToggleFavorite, onToggleWatched }: MovieCardProps) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <motion.div
      variants={scaleUp}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm shadow-lg"
    >
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
        
        <div className="absolute top-4 right-4 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(movie.id);
            }}
            className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg transition-all duration-300"
          >
            <Heart
              className={`w-5 h-5 transition-colors duration-300 ${
                isFavorite ? 'fill-primary text-primary' : 'text-primary-foreground'
              }`}
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              onToggleWatched(movie.id);
            }}
            className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg transition-all duration-300"
          >
            <Clock
              className={`w-5 h-5 transition-colors duration-300 ${
                isWatched ? 'fill-primary text-primary' : 'text-primary-foreground'
              }`}
            />
          </motion.button>
        </div>

        <Link
          to={`/movie/${movie.id}`}
          className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-bold text-card-foreground mb-2 drop-shadow-lg">
              {movie.title}
            </h3>
            <div className="flex items-center gap-4 text-card-foreground/90">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow" />
                <span className="text-sm font-medium">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
              <span className="text-sm">
                {new Date(movie.release_date).getFullYear()}
              </span>
            </div>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
}

