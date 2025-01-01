import axios from "axios";
import { TMDB_CONFIG } from "../config/tmdb";

const tmdbApi = axios.create({
  baseURL: TMDB_CONFIG.baseUrl,
  params: {
    api_key: TMDB_CONFIG.apiKey,
    language: "en-US",
    include_adult: false,
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

const adultGenres = [99];  
const inappropriateGenres = [10402, 10751];

const excludeAdultContent = (movies: Movie[]) => {
  return movies.filter(
    (movie) =>
      !movie.genre_ids.some((genreId) =>
        adultGenres.includes(genreId) || inappropriateGenres.includes(genreId)
      )
  );
};

export const getPopularMovies = async (page = 1) => {
  const response = await tmdbApi.get<MovieResponse>("/movie/popular", {
    params: { page },
  });
  return {
    ...response.data,
    results: excludeAdultContent(response.data.results),
  };
};

export const searchMovies = async (query: string, page = 1) => {
  const response = await tmdbApi.get<MovieResponse>("/search/movie", {
    params: { query, page },
  });
  return {
    ...response.data,
    results: excludeAdultContent(response.data.results),
  };
};

export const getMovieDetails = async (movieId: number) => {
  const response = await tmdbApi.get(`/movie/${movieId}`, {
    params: {
      append_to_response: "videos,credits,similar",
    },
  });
  return response.data;
};

export const getMovieGenres = async () => {
  const response = await tmdbApi.get("/genre/movie/list");
  return response.data.genres;
};

export const getMovieSoundtrack = async (movieId: number) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/videos`);
    const videos = response.data.results;
    const soundtrack = videos.find(
      (video: any) =>
        video.type.toLowerCase().includes("soundtrack") ||
        video.name.toLowerCase().includes("soundtrack") ||
        video.type.toLowerCase().includes("music")
    );
    if (soundtrack) {
      return `https://www.youtube.com/watch?v=${soundtrack.key}`;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getRandomMovie = async (
  favoriteIds: number[],
  highlyRatedMovies: { id: number; rating: number }[]
) => {
  const movieIds = [
    ...new Set([...favoriteIds, ...highlyRatedMovies.map((m) => m.id)]),
  ];
  const movieDetails = await Promise.all(
    movieIds.map((id) => getMovieDetails(id))
  );

  const genres = [
    ...new Set(movieDetails.flatMap((m) => m.genres.map((g: { id: number }) => g.id))),
  ];

  const recommendations = await Promise.all(
    genres.map((genreId) =>
      tmdbApi.get<MovieResponse>("/discover/movie", {
        params: {
          with_genres: genreId,
          "vote_average.gte": 7,
          "vote_count.gte": 100,
          include_adult: false,
        },
      })
    )
  );

  const movies = recommendations
    .flatMap((r) => r.data.results)
    .filter(
      (m) =>
        !favoriteIds.includes(m.id) &&
        !highlyRatedMovies.find((w) => w.id === m.id)
    );

  const filteredMovies = excludeAdultContent(movies);

  if (filteredMovies.length === 0) {
    const response = await tmdbApi.get<MovieResponse>("/movie/popular", {
      params: { include_adult: false },
    });
    return response.data.results[
      Math.floor(Math.random() * response.data.results.length)
    ];
  }

  return filteredMovies[Math.floor(Math.random() * filteredMovies.length)];
};
