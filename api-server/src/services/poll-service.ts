import { getPollVMFromPoll, getPollVMWithoutMoviesAndTokens, PollInput, PollVM } from "../shared/type-interfaces/movie-poll-types";
import prisma from '../prisma-client';
import { MoviePoll, Poll, Prisma } from ".prisma/client";
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
   * Add a movie to a poll.
   * @param pollId The Id of the Poll
   * @param movieId The Id of the movie
   * @param userId The current usedId
   * @returns 
   */
  static async addMovie(pollId: number, movieId: number, userId: string): Promise<PollVM> {
    const poll = await prisma.poll.findFirst({
      where: {id: pollId, AND: {userId: userId}},
      include: {movies: true}
    });

    if (!poll)
      throw new Error('NOT_VALID_USER');

    // Each poll has a limit of five movies.
    if (poll.movies.length >= 5) 
      throw new Error('FULL_POLL');

    const movie: Prisma.MoviePollCreateNestedManyWithoutPollInput = {
      create: {
        movieId: movieId
      }
    };

    const data = { movies: movie };
  
    const res = await prisma.poll.update({
      where: {id: pollId},
      data: data,
      include: {movies: true, tokens: true}
    });

    const pollVM = getPollVMFromPoll(res);
    const pollResult: PollVM = {
      ...pollVM,
      movies: await Promise.all(pollVM.movies.map(async movie => ({
        ...movie,
        movie: getMovieFromMovieDetails(await MoviesService.fetchMovieDetails(movie.movieId)) 
      })))
    };

    return pollResult;
  }

  /**
   * Gets user polls.
   * @param userId the id of the user who created the polls
   * @returns a Promise of a list of open polls
   */
	static async getPollsByUser(userId: string): Promise<PollVM[]> {
    const res = await prisma.poll.findMany({
      where: {userId: userId},
      include: {movies: true, tokens: true},
      orderBy: [{createdAt: 'desc'}]
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

  /**
   * Removes a movie from a poll.
   * @param pollId The id of the poll
   * @param movieId The id of the movie
   * @param userId The userId of the authenticated user
   * @returns a Promise containing a MoviePoll object 
   */
  static async removeMovie(pollId: number, movieId: number, userId: string): Promise<MoviePoll> {
    const poll = await prisma.poll.findFirst({
      where: {
        userId: userId,
        AND: {
          id: pollId
        }
      },
      include: {movies: true}
    });

    if (!poll) 
      throw new Error('USER_POLL_BAD_ACCESS');
    
    if (poll.movies.length === 0)
      throw new Error('EMPTY_POLL');

    const res = await prisma.moviePoll.delete({
      where: {
        pollId_movieId: {pollId: pollId, movieId: movieId}
      }
    });

    // if a poll just has one movie, the poll is deleted.
    if (poll.movies.length === 1 && poll.movies[0].movieId === movieId) {
      await prisma.poll.delete({
        where: {id: pollId}
      });
    }

    return res;
  }

  /**
   * Removes a poll.
   * @param pollId the id of the poll
   * @param userId The userId of the authenticated user
   * @returns a Promise containing a PollVM object
   */
  static async removePoll(pollId: number, userId: string): Promise<Omit<PollVM, 'movies' | 'tokens'>> {
    const poll = await prisma.poll.findFirst({where: {id: pollId}});

    // checks if poll exist
    if (!poll)
      throw new Error('POLL_NOT_FOUND');
    
    // checks if the current user is the poll owner
    if (poll.userId !== userId)
      throw new Error('USER_POLL_BAD_ACCESS');
    
    // Because cascading deletes in Prisma are a FUTURE RELEASE, at the moment,
    // deleting a poll with its own movies should be done in two operations:
    // 1. delete all movies in MoviePoll for that poll.
    // 2. delete the poll in question.
    // A Transaction must be used in order to handle those operations.

    const deleteMovies = prisma.moviePoll.deleteMany({where: {pollId: pollId}});
    const deletePoll = prisma.poll.delete({where: {id: pollId}});

    const res = await prisma.$transaction([deleteMovies, deletePoll]);

    return getPollVMWithoutMoviesAndTokens(res[1]);
  }
}