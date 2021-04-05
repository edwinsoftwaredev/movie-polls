import { getPollVMFromPoll, PollInput, PollVM } from "../shared/type-interfaces/movie-poll-types";
import prisma from '../prisma-client';
import { Prisma } from ".prisma/client";
import { getMovieFromMovieDetails } from "../shared/type-interfaces/movie-types";
import MoviesService from "./movie-service";

export default class PollService {
  /**
   * Creates a poll submitted by a user.
   * @param poll the poll to be store in database
   * @param userId the id of the user who is submitting the poll
   * @returns a Promise of PollVM
   */
	static async createPoll(poll: PollVM, userId: string): Promise<PollVM> {
		const initialMovies: Prisma.MoviePollCreateWithoutPollInput[] = poll.movies.map(movie => ({
			movieId: movie.movieId,
			voteCount: movie.voteCount
		}));

		const data: PollInput = {
			name: poll.name,
			movies: initialMovies ? {create: initialMovies} : undefined,
			tokens: undefined,
			userId: userId
		};

		const res = await prisma.poll.create({
			data: data,
			include: {movies: true, tokens: true}
		});

		const movieDetails = await MoviesService.fetchMovieDetails(res.movies[0].movieId);
		const movie = getMovieFromMovieDetails(movieDetails);

		const pollVM = getPollVMFromPoll(res);
		const pollResult: PollVM = {
			...pollVM,
			movies: res.movies.map(item => ({
				movieId: item.movieId,
				voteCount: item.voteCount,
				movie: movie
			}))
		};

		return pollResult;
	}

  /**
   * Gets the open polls of a user.
   * @param userId the id of the user who created the polls
   * @returns a Promise of a list of open polls
   */
	static async getPollsByUserAndOpenedStatus(userId: string, opened: boolean): Promise<PollVM[]> {
    const res = await prisma.poll.findMany({
      where: {userId: userId, AND: {isOpen: opened}},
      include: {movies: true, tokens: true}
    });

    /*
     * This is how to make calls to asyncronous functions nested in 
     * Array.map(). Just wrap "map()" function with "await Promise.all()"
     */
    const polls = await Promise.all(res.map(async item => {
      const pollVM = getPollVMFromPoll(item);

      return {
        ...pollVM,
        movies: await Promise.all(item.movies.map(async movie => {
          const movieDetails = await MoviesService.fetchMovieDetails(movie.movieId);
          const movieObj = getMovieFromMovieDetails(movieDetails);

          return {
            movieId: movie.movieId,
            voteCount: movie.voteCount,
            movie: movieObj
          };
        }))
      };
    }));

    return polls;
	}
}