import Axios, { AxiosResponse } from "axios";
import { MoviesTypes } from "../shared/cache-movie-types";
import { IGenre, IGenreRequest, IMovie, IMovieRequest } from "../shared/type-interfaces/movie-types";

/**
 * TODO: Update functions.
 */

/**
 * Fetches a list of genres used by TMDB API.
 * @returns A Promise of a list of genres. 
 */
async function fetchGenres(): Promise<IGenre[]> {
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
 * Fetchs a list of 10 top movies from TMDB API.
 * Don't use this function to resolve client requests.
 * This is a function that will be executed as a part of scheduled job.
 * @returns IMovie[]
 */
async function fetchBestMoviesByType_Job(moviesType: MoviesTypes): Promise<IMovie[]> {
  const movieList: IMovie[] = [];
  const promises: Promise<void>[] = [];
  const genres = await fetchGenres();
  const url = `${process.env.TMDB_API_URL}/movie/popular`;
  const nowDate = new Date(Date.now());
  const previousYear = new Date(nowDate.setFullYear(nowDate.getFullYear() - 1));

  const bestMoviesFilter = (movie: IMovie): boolean => {
    switch (moviesType) {
      case MoviesTypes.TopPopularMovies:
        return (new Date(movie.release_date) >= previousYear) && (movie.vote_count >= 1000 && movie.vote_average >= 7);
      case MoviesTypes.TopTrendingMovies: {
        const date = new Date(movie.release_date);

        return (date >= previousYear) && 
          (movie.vote_average >= 7) &&
          (movie.vote_count >= 50);
      }
      default: 
        return false;
    }
  };

  // This function is a wrapper and will help the parallel execution of the promises
  const filterByReleaseDate = async (promise: Promise<AxiosResponse<IMovieRequest>>) => {
    const res = await promise;

    const filteredMovies: IMovie[] = res.data.results
      .filter(movie => bestMoviesFilter(movie))
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

        const appendedPromise = filterByReleaseDate(getMovieListByPage(url, appendedPages));
        appendedPages++;
        return appendPromise(appendedPromise);
      });
    };

    // this will execute, in parallel, a pool of concurrent requests of 
    // the size defined in maxConcurrency variable.
    const initialChunk = async () => {
      for (let page = 1; page <= maxConcurrency; page++) {
        const promise = filterByReleaseDate(getMovieListByPage(url, page));
        promises.push(promise)
      }

      await Promise.all(promises.map(appendPromise));
    };

    return await initialChunk();
  }

  await executeByParallelChunks();

  switch (moviesType) {
    case MoviesTypes.TopPopularMovies: 
      return movieList
        .sort((a, b) => b.vote_count - a.vote_count)
        .slice(0, 10)
        .sort((a, b) => b.vote_average - a.vote_average)
    case MoviesTypes.TopTrendingMovies:
      return movieList
        .sort((a, b) => new Date(b.release_date) >= new Date(a.release_date) ? 1 : -1)
        .slice(0, 10)
        .sort((a, b) => b.vote_average - a.vote_average)
    default:
      throw new Error('The given type is not a valid BestMoviesType');
  }
}

/**
 * Gets a list of movies by page.
 * @param url The url to request against to.
 * @param page The request's page.
 * @returns A Promise of a page of movies.
 */
function getMovieListByPage(url: string, page: number): Promise<AxiosResponse<IMovieRequest>> {    
  return Axios.get<IMovieRequest>(url, {
    params: {
      api_key: process.env.TMDB_API_KEY,
      page: page
    }
  });
}