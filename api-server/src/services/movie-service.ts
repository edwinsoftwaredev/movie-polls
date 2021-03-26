import Axios from 'axios';
import prisma from '../prisma-client';
import { MoviesTypes } from '../shared/cache-movie-types';
import { IGenre, IGenreRequest, IMovie, IMovieDetail, IMovieRequest, IMoviesByGenre } from "../shared/type-interfaces/movie-types";

// TODO: Make this class use the sigleton pattern if it is required.
export default class MoviesService {

  /**
   * Fetches a list of genres used by TMDB API.
   * @returns A Promise of a list of genres. 
   */
  static async fetchGenres(): Promise<IGenre[]> {
    const genresResponse = await Axios.get<IGenreRequest>(
      `${process.env.TMDB_API_URL}/genre/movie/list`, 
      {
        params: {
          api_key: process.env.TMDB_API_KEY
        }
      }
    );
    
    return genresResponse.data.genres;
  }

  /**
   * Fetch popular movies.
   * @returns A Promise of popular movies
   */
  static async fetchTopTrendingMovies(): Promise<IMovie[]> {
    const cache = await prisma.bestMovies.findFirst({where: {type: MoviesTypes.TopTrendingMovies}});

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return cache ? cache.movies?.result : [];
  }

  /**
   * Fetchs top 10 best popular movies.
   * This function uses the TMDB's discovery endpoint.
   * @returns a Promise of a list of 10 best popular movies
   */
  static async fetchTopPopularMovies_job(): Promise<IMovie[]> {
    const now = new Date(Date.now());
    const fromDate = new Date(now.setFullYear(now.getFullYear() - 1));

    const genres = await this.fetchGenres();

    const res = await Axios.get<IMovieRequest>(`${process.env.TMDB_API_URL}/discover/movie`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        sort_by: 'vote_average.desc',
        page: 1,
        'primary_release_date.gte': fromDate.toISOString().split('T')[0],
        'vote_average.gte': 7,
        'vote_count.gte': 1000,
      }
    });

    const movies = res.data.results.map(movie => ({
      ...movie, 
      genre_names: movie.genre_ids.map(id => genres.find(item => item.id === id)?.name ?? '') 
    }))
    .sort((a, b) => b.vote_count - a.vote_count)
    .slice(0, 10)
    .sort((a, b) => b.vote_average - a.vote_average);

    return movies;
  }

  /**
   * Fetchs a list of top movies by year gruped by genre.
   * @param year year of release
   * @returns a Promise of IMoviesByGenre[]
   */
  static async fetchTopMoviesByGenresAndYear(year: string): Promise<IMoviesByGenre[]> {
    const genres = await this.fetchGenres();
    const promises: Promise<IMoviesByGenre>[]= [];
    const date = new Date(new Date().setHours(0, 0, 0, 0));
    const initDate = new Date(new Date(date).setFullYear(Number.parseInt(year), 0, 1));
    const endDate = new Date(new Date(initDate).setMonth(11, 31));
    
    const fetchPageByGenreId = async (id: number): Promise<IMoviesByGenre> => {
      const res = await Axios.get<IMovieRequest>(`${process.env.TMDB_API_URL}/discover/movie`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
          sort_by: 'vote_average.desc',
          page: 1,
          'with_genres': `${id}`,
          'vote_count.gte': 500,
          'primary_release_date.gte': initDate.toISOString().split('T')[0],
          'primary_release_date.lte': endDate.toISOString().split('T')[0]
        }
      });

      const movies = res.data.results.map(movie => ({
        ...movie,
        genre_names: movie.genre_ids.map(id => genres.find(item => item.id === id)?.name ?? '')
      }));

      const result: IMoviesByGenre = {
        genre_name: genres.find(item => item.id === id)?.name ?? '',
        results: movies
      };

      return result;
    }

    genres.filter(genres => genres.name !== 'Documentary').forEach(genre => {
      promises.push(fetchPageByGenreId(genre.id));
    });

    const result = await Promise.all(promises);

    return result.filter(value => value.results.length !== 0);
  }

  /**
   * Fetchs a list of trending movies gruped by genre.
   * @returns a Promise of IMoviesByGenres[]
   */
  static async fetchTrendingMoviesByGenres(): Promise<IMoviesByGenre[]> {
    const genres = await this.fetchGenres();
    const promises: Promise<IMoviesByGenre>[] = [];
    const now = new Date(Date.now());
    const fromDate = new Date(now.setFullYear(now.getFullYear() - 2));

    const fetchPageByGenreId = async (id: number): Promise<IMoviesByGenre> => {
      const res  = await Axios.get<IMovieRequest>(`${process.env.TMDB_API_URL}/discover/movie`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
          sort_by: 'popularity.desc',
          page: 1,
          // 'primary_release_date.gte': fromDate.toISOString().split('T')[0],
          'with_genres': `${id}`,
          'vote_average.gte': 1, 
          'vote_count.gte': 50
        }
      });

      const movies = res.data.results.map(movie => ({
        ...movie,
        genre_names: movie.genre_ids.map(id => genres.find(item => item.id === id)?.name ?? '')
      }));

      const result: IMoviesByGenre = {
        genre_name: genres.find(item => item.id === id)?.name ?? '', 
        results: movies
      };

      return result;
    };

    genres.filter(genre => genre.name !== 'Documentary').forEach(genre => {
      promises.push(fetchPageByGenreId(genre.id));
    });

    const result = await Promise.all(promises);

    return result;
  }

  /**
   * Fetchs the top 10 trending movies.
   * This function is using the TMDB's discovery endpoint.
   * @returns a Promise of a list of 10 Top Trending Movies
   */
  static async fetchTopTrendingMovies_job(): Promise<IMovie[]> {
    const now = new Date(Date.now());
    const fromDate = new Date(now.setFullYear(now.getFullYear() - 1));

    const genres = await this.fetchGenres();

    const res = await Axios.get<IMovieRequest>(`${process.env.TMDB_API_URL}/discover/movie`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        sort_by: 'primary_release_date.desc',
        page: 1,
        'primary_release_date.gte': fromDate.toISOString().split('T')[0],
        'vote_average.gte': 7,
        'vote_count.gte': 50
      }
    });

    const movies = res.data.results.map(movie => ({
      ...movie,
      genre_names: movie.genre_ids.map(id => genres.find(item => item.id === id)?.name ?? '')
    }))
    // .sort((a, b) => new Date(b.release_date) >= new Date(a.release_date) ? 1 : -1)
    .slice(0, 10)
    .sort((a, b) => b.vote_average - a.vote_average);

    return movies;
  }

  /**
   * Fetchs Now Playing movie from TMDB API.
   * @returns a Promise of Now Playing movies
   */
  static async fetchNowPlayingMovies_job(): Promise<IMovie[]> {
    const genres = await this.fetchGenres();
    const res = await Axios.get<IMovieRequest>(`${process.env.TMDB_API_URL}/discover/movie`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        page: 1,
        sort_by: 'primary_release_date.desc',
        'primary_release_date.lte': new Date().toISOString().split('T')[0],
        'vote_average.gte': 1, 
        'vote_count.gte': 50,
      }
    });
    const movies = res.data.results.map(movie => ({
      ...movie,
      genre_names: movie.genre_ids.map(id => genres.find(item => item.id === id)?.name ?? '')
    }));

    return movies;
  }

  /**
   * Fetches the details of a movie.
   * @param movieId The id of the movie.
   * @returns A Promise of movie details.
   */
  static async fetchMovieDetails(movieId: number): Promise<IMovieDetail> {
    const res = await Axios.get<IMovieDetail>(
      `${process.env.TMDB_API_URL}/movie/${movieId}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        append_to_response: 'credits,release_dates'
      }
    });

    return res.data;
  }

  /**
   * Fetchs a list of 10 top movies from database or cache
   * @returns IMovie[]
   */
  static async fetchTopPopularMovies(): Promise<IMovie[]> {
    const cache = await prisma.bestMovies.findFirst({where: {type: MoviesTypes.TopPopularMovies}});
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return cache ? cache.movies?.result : [];
  }

  /**
   * Fetchs cache of Now Playing movies.
   * @returns a Promise of Now Playing movies
   */
  static async fetchNowPlayingMovies(): Promise<IMovie[]> {
    const cache = await prisma.bestMovies.findFirst({where: {type: MoviesTypes.NowPlayingMovies}});
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return cache ? cache.movies?.result : [];
  }

  /**
   * Executes a function to fetch movies based on a given type movie collection.
   * @param moviesType the type of movie collection
   * @returns a Promise of IMovie[]
   */
  static async fetchMoviesByType_Job(moviesType: MoviesTypes): Promise<IMovie[]> {
    switch (moviesType) {
      case MoviesTypes.TopPopularMovies: {
        return await this.fetchTopPopularMovies_job();
      }
      case MoviesTypes.TopTrendingMovies: {
        return await this.fetchTopTrendingMovies_job();
      }
      case MoviesTypes.NowPlayingMovies: {
        return await this.fetchNowPlayingMovies_job();
      }
      default: 
        return [];
    }
  }
}