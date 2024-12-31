import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Heart, Star, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { getMovieDetails } from '../services/tmdb';
import { useFavorites } from '../hooks/useFavorites';
import { useWatched } from '../hooks/useWatched';
import RatingModal from '../components/RatingModal';
import { TMDB_CONFIG } from '../config/tmdb';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useFavorites();
  const { watched, toggleWatched, updateWatchedMovie } = useWatched();
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const isFavorite = favorites.includes(Number(id));

  const watchedMovie = watched.find(w => w.id === Number(id));
  const isWatched = !!watchedMovie;

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovieDetails(Number(id));
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading || !movie) {
    return <div className="min-h-screen bg-background" />;
  }

  const backdropUrl = `${TMDB_CONFIG.imageBaseUrl}/${TMDB_CONFIG.backdropSizes.original}${movie.backdrop_path}`;
  const posterUrl = `${TMDB_CONFIG.imageBaseUrl}/${TMDB_CONFIG.posterSizes.large}${movie.poster_path}`;
  const trailer = movie.videos?.results.find((v: any) => v.type === 'Trailer');

  const handleToggleWatched = () => {
    toggleWatched(Number(id));
    if (!isWatched) {
      setIsRatingModalOpen(true);
    }
  };

  const handleRatingSubmit = (rating: number, comment: string) => {
    updateWatchedMovie(Number(id), rating, comment);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen bg-background"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/40" />
        <img
          src={backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-24">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Browse
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl"
            >
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  {movie.title}
                </h1>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleFavorite(movie.id)}
                    className="p-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg"
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        isFavorite ? 'fill-primary text-primary' : 'text-foreground'
                      }`}
                    />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleToggleWatched}
                    className="p-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg"
                  >
                    <Clock
                      className={`w-6 h-6 ${
                        isWatched ? 'fill-primary text-primary' : 'text-foreground'
                      }`}
                    />
                  </motion.button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-foreground/80 mb-8">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{movie.runtime} min</span>
                </div>
              </div>

              <p className="text-lg text-foreground/90 mb-8">{movie.overview}</p>

              <div className="flex flex-wrap gap-3 mb-8">
                {movie.genres.map((genre: any) => (
                  <span
                    key={genre.id}
                    className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {watchedMovie && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">Your Rating</h2>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <span className="text-lg">{watchedMovie.rating}/5</span>
                  </div>
                  {watchedMovie.comment && (
                    <>
                      <h3 className="text-xl font-bold mb-2">Your Comment</h3>
                      <p className="text-foreground/90 mb-6">{watchedMovie.comment}</p>
                    </>
                  )}
                </div>
              )}

              {trailer && (
                <motion.a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-lg shadow-lg hover:brightness-110 transition-all"
                >
                  <Play className="w-5 h-5" />
                  Watch Trailer
                </motion.a>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmit={handleRatingSubmit}
        initialRating={watchedMovie?.rating}
        initialComment={watchedMovie?.comment}
      />
    </motion.div>
  );
}
