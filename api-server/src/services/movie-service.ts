import Axios, { AxiosResponse } from 'axios';
import prisma from '../prisma-client';
import { IGenre, IGenreRequest, IMovie, IMovieDetail, IMovieRequest } from "../shared/type-interfaces/movie-types";

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
  static async fetchTopMovies(): Promise<IMovie[]> {
    const cache = await prisma.topMovies.findFirst();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return cache ? cache.topMovies?.result : [];
  }

  /**
   * Fetchs a list of 10 top movies from TMDB API.
   * Don't use this function to resolve client requests.
   * This is a function that will be executed as a part of scheduled job.
   * @returns IMovie[]
   */
  static async fetchTopMovies_Job(): Promise<IMovie[]> {
    const movieList: IMovie[] = [];
    const promises: Promise<void>[] = [];
    const genres = await this.fetchGenres();
    const url = `${process.env.TMDB_API_URL}/movie/popular`
    const nowDate = new Date(Date.now());
    const previousYear = new Date(nowDate.setFullYear(nowDate.getFullYear() - 1));

    // This function is a wrapper and will help the parallel execution of the promises
    const filterByReleaseDate = async (promise: Promise<AxiosResponse<IMovieRequest>>) => {
      const res = await promise;

      const filteredMovies: IMovie[] = res.data.results
        .filter(movie => (new Date(movie.release_date) >= previousYear) && (movie.vote_count >= 1000 && movie.vote_average >= 7))
        .map(movie => ({
          ...movie,
          genre_names: movie.genre_ids.map(id => genres.find(item => item.id === id)?.name ?? '')
        }));

      movieList.push(...filteredMovies);

      return;
    }

    const executeByParallelChunks = async () => {
      // this is an optimal number of concurrent requests in parallel
      // more than this number ECONNRESET error are thrown
      // less than this makes the request longer to be resolved
      const maxConcurrency = 50; // avg. response time: 7s
      let appendedPages = maxConcurrency + 1;
      const maxPages = 500; // this is the max number of pages in TMDB

      // this function will add append a new promise to a resolved one.
      // this will keep a poll of 100 request at any time
      const appendPromise = async (promise: Promise<void>) => {
        return promise.then((): Promise<void> => {
          if (appendedPages > maxPages) {
            return Promise.resolve();
          }

          promises.push(promise);

          const appendedPromise = filterByReleaseDate(this.getMovieListByPage(url, appendedPages));
          appendedPages++;
          return appendPromise(appendedPromise);
        });
      };

      // this will execute, in parallel, a pool of concurrent requests of 
      // the size defined in maxConcurrency variable.
      const initialChunk = async () => {
        for (let page = 1; page <= maxConcurrency; page++) {
          const promise = filterByReleaseDate(this.getMovieListByPage(url, page));
          promises.push(promise)
        }

        await Promise.all(promises.map(appendPromise));
      };

      return await initialChunk();
    }

    await executeByParallelChunks();
    const topMovies = movieList
      .sort((a, b) => b.vote_count - a.vote_count)
      .slice(0, 10)
      .sort((a, b) => b.vote_average - a.vote_average);

    return Promise.resolve<IMovie[]>(topMovies);
  }

  /**
   * Gets a list of movies by page.
   * @param url The url to request against to.
   * @param page The request's page.
   * @returns A Promise of a page of movies.
   */
  static getMovieListByPage(url: string, page: number): Promise<AxiosResponse<IMovieRequest>> {    
    return Axios.get<IMovieRequest>(url, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        page: page
      }
    });
  }
}