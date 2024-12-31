export const TMDB_CONFIG = {
  apiKey: import.meta.env.VITE_TMDB_API_KEY,
  baseUrl: 'https://api.themoviedb.org/3',
  imageBaseUrl: 'https://image.tmdb.org/t/p',
  backdropSizes: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original'
  },
  posterSizes: {
    small: 'w154',
    medium: 'w342',
    large: 'w500',
    original: 'original'
  }
} as const;