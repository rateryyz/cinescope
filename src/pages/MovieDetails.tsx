import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Heart,
  Star,
  Calendar,
  Clock,
  ArrowLeft,
  Volume2,
  VolumeX,
} from "lucide-react";
import { getMovieDetails, getMovieSoundtrack } from "../services/tmdb";
import { useFavorites } from "../hooks/useFavorites";
import { useWatched } from "../hooks/useWatched";
import { useSoundtrack } from "../hooks/useSoundtrack";
import RatingModal from "../components/RatingModal";
import { TMDB_CONFIG } from "../config/tmdb";

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [soundtrackUrl, setSoundtrackUrl] = useState<string | null>(null);
  const { favorites, toggleFavorite } = useFavorites();
  const { watched, toggleWatched, updateWatchedMovie } = useWatched();
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const isFavorite = favorites.includes(Number(id));

  const watchedMovie = watched.find((w) => w.id === Number(id));
  const isWatched = !!watchedMovie;

  const { volume, isPlaying, isReady, play, toggle } =
    useSoundtrack(soundtrackUrl);

  const [trailer, setTrailer] = useState<any>(null);

  useEffect(() => {
    const fetchMovieAndSoundtrack = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [movieData, soundtrackData] = await Promise.all([
          getMovieDetails(Number(id)),
          getMovieSoundtrack(Number(id)),
        ]);
        setMovie(movieData);
        setSoundtrackUrl(soundtrackData);
        setTrailer(
          movieData.videos?.results.find((v: any) => v.type === "Trailer")
        );
      } catch (error) {
        console.error("Error fetching movie or soundtrack:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieAndSoundtrack();
  }, [id]);

  useEffect(() => {
    if (isReady && soundtrackUrl) {
      console.log("Audio is ready, attempting to play");
      play();
    }
  }, [isReady, play, soundtrackUrl]);

  if (loading || !movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `${TMDB_CONFIG.imageBaseUrl}/${TMDB_CONFIG.backdropSizes.original}${movie.backdrop_path}`
    : "/placeholder.svg?height=1080&width=1920";
  const posterUrl = movie.poster_path
    ? `${TMDB_CONFIG.imageBaseUrl}/${TMDB_CONFIG.posterSizes.large}${movie.poster_path}`
    : "/placeholder.svg?height=750&width=500";

  const handleToggleWatched = () => {
    if (id) {
      toggleWatched(Number(id));
      if (!isWatched) {
        setIsRatingModalOpen(true);
      }
    }
  };

  const handleRatingSubmit = (rating: number, comment: string) => {
    if (id) {
      updateWatchedMovie(Number(id), rating, comment);
    }
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
        <div className="container mx-auto px-4 py-24 sm:py-28">
          <div className="flex justify-between items-center mb-8 sm:mb-12">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              Back to Browse
            </Link>
            {soundtrackUrl && (
              <div className="flex items-center gap-2 text-foreground/80">
                <button
                  onClick={toggle}
                  className="p-2 sm:p-3 rounded-full hover:bg-background/50"
                  disabled={!isReady}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </button>
                {volume > 0 ? (
                  <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
                <div className="w-24 sm:w-32 h-1 bg-foreground/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${volume * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] lg:grid-cols-[350px,1fr] gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-[2/3] sm:aspect-[3/4] rounded-xl overflow-hidden shadow-2xl"
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
              <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                  {movie.title}
                </h1>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => id && toggleFavorite(Number(id))}
                    className="p-2 sm:p-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg"
                  >
                    <Heart
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${
                        isFavorite ? "fill-primary text-primary" : "text-foreground"
                      }`}
                    />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleToggleWatched}
                    className="p-2 sm:p-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg"
                  >
                    <Clock
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${
                        isWatched ? "fill-primary text-primary" : "text-foreground"
                      }`}
                    />
                  </motion.button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-foreground/80 mb-6 sm:mb-8">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400 text-amber-400" />
                  <span>{movie.vote_average?.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>
                    {movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>{movie.runtime ? `${movie.runtime} min` : "N/A"}</span>
                </div>
              </div>

              <p className="text-base sm:text-lg text-foreground/90 mb-6 sm:mb-8">
                {movie.overview}
              </p>

              <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                {movie.genres?.map((genre: any) => (
                  <span
                    key={genre.id}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {watchedMovie && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">Your Rating</h2>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-primary text-primary" />
                    <span className="text-lg">{watchedMovie.rating}/5</span>
                  </div>
                  {watchedMovie.comment && (
                    <p className="text-sm text-foreground/70">{watchedMovie.comment}</p>
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

          {isRatingModalOpen && (
            <RatingModal
              isOpen={isRatingModalOpen}
              onClose={() => setIsRatingModalOpen(false)}
              onSubmit={handleRatingSubmit}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
