import axios from 'axios';
import { TMDB_CONFIG } from '../config/tmdb';

const tmdbApi = axios.create({
  baseURL: TMDB_CONFIG.baseUrl,
  params: {
    api_key: TMDB_CONFIG.apiKey,
    language: 'en-US',
  },
});

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const getPopularMovies = async (page = 1) => {
  const response = await tmdbApi.get<MovieResponse>('/movie/popular', { 
    params: { page } 
  });
  return response.data;
};

export const searchMovies = async (query: string, page = 1) => {
  const response = await tmdbApi.get<MovieResponse>('/search/movie', {
    params: { query, page },
  });
  return response.data;
};

export const getMovieDetails = async (movieId: number) => {
  const response = await tmdbApi.get(`/movie/${movieId}`, {
    params: {
      append_to_response: 'videos,credits,similar'
    }
  });
  return response.data;
};

export const getMovieGenres = async () => {
  const response = await tmdbApi.get('/genre/movie/list');
  return response.data.genres;
};

