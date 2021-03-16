import Axios from 'axios';
import { IMovieDetail } from '../shared/interfaces/movie-types';

export default class MovieService {

  /**
   * Gets details of a movie.
   * @param id The Id of the movie.
   * @returns A Promise of movie details.
   */
  static async getMovieDetails(id: number): Promise<IMovieDetail> {
    const res = await Axios.get(
      `${process.env.REACT_APP_API_SERVER}/api/movies/movie-details/${id}`
    );

    return res.data;
  }
}