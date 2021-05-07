import { getPollVMFromPoll, getPollVMWithoutMoviesAndTokens, IPoll_PATCH, PollInput, PollVM } from "../shared/type-interfaces/movie-poll-types";
import prisma from '../prisma-client';
import { MoviePoll, Prisma } from ".prisma/client";
import { IMovieDetail } from "../shared/type-interfaces/movie-types";
import MoviesService from "./movie-service";
import * as admin from 'firebase-admin';
import {v4 as uuid4} from 'uuid';
import { Token } from "@prisma/client";

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
    const movie: IMovieDetail = {
      ...movieDetails,
      genre_names: movieDetails.genres.map(genre => genre.name),
      genre_ids: movieDetails.genres.map(genre => genre.id),
      providers: await MoviesService.fetchMovieProviders(movieDetails.id)
    };

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
      where: {id: pollId, AND: {userId: userId, isOpen: true}},
      include: {movies: true}
    });

    if (!poll)
      throw new Error('POLL_NOT_FOUND');

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
      movies: await Promise.all(pollVM.movies.map(async movie => {
        const movieDetails = await MoviesService.fetchMovieDetails(movie.movieId);
        return {
          ...movie,
          movie: {
            ...movieDetails,
            genre_names: movieDetails.genres.map(genre => genre.name),
            genre_ids: movieDetails.genres.map(genre => genre.id),
            providers: await MoviesService.fetchMovieProviders(movie.movieId)
          }
        }
      }))
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
      const tokenQty = item.tokens.length;
      const pollVM = getPollVMFromPoll(item);

      return {
        ...pollVM,
        movies: await Promise.all(item.movies.map(async movie => {
          const movieDetails = await MoviesService.fetchMovieDetails(movie.movieId);
          const movieObj = {
            ...movieDetails,
            genre_names: movieDetails.genres.map(genre => genre.name),
            genre_ids: movieDetails.genres.map(genre => genre.id),
            providers: await MoviesService.fetchMovieProviders(movie.movieId)
          }

          return {
            movieId: movie.movieId,
            voteCount: movie.voteCount,
            movie: movieObj
          };
        })),
        tokenQty: tokenQty
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

    if (!poll.isOpen)
      throw new Error('POLL_NOT_OPEN');

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
    const poll = await prisma.poll.findFirst({where: {id: pollId, userId: userId}});

    // checks if poll exist
    if (!poll)
      throw new Error('POLL_NOT_FOUND');
    
    // Because cascading deletes in Prisma are a FUTURE RELEASE, at the moment,
    // deleting a poll with its own movies should be done in two operations:
    // 1. delete all movies in MoviePoll for that poll.
    // 2. delete the poll in question.
    // A Transaction must be used in order to handle those operations.

    const deleteMovies = prisma.moviePoll.deleteMany({where: {pollId: pollId}});
    const deletePoll = prisma.poll.delete({where: {id: pollId}});
    const deleteTokens = prisma.token.deleteMany({where: {pollId: pollId}});

    const res = await prisma.$transaction([deleteTokens, deleteMovies, deletePoll]);

    return getPollVMWithoutMoviesAndTokens(res[2]);
  }

  /**
   * Patches a Poll
   * @param pollId The id of the Poll
   * @param pollPatch The patch object to apply
   * @param userId The User's ID
   * @returns a Promise of a Poll
   */
  static async patchPoll(pollId: number, pollPatch: IPoll_PATCH, userId: string): Promise<Omit<PollVM, 'movies' | 'tokens'>> {
    const poll = await prisma.poll.findFirst({where: {id: pollId, AND: {userId: userId}}});

    if (!poll)
      throw new Error('POLL_NOT_FOUND');

    if (
      poll.endsAt && pollPatch.endsAt && 
      (
        new Date(pollPatch.endsAt) <= new Date() || 
        isNaN(new Date(pollPatch.endsAt).getDate())
      ) || 
      (poll.isOpen && typeof pollPatch.isOpen !== 'undefined' && !pollPatch.isOpen &&
      ((poll.endsAt && typeof pollPatch.endsAt === 'undefined' && poll.endsAt <= new Date()) || 
        (typeof pollPatch.endsAt !== 'undefined' && pollPatch.endsAt && new Date(pollPatch.endsAt) <= new Date())
      )) 
    )
      throw new Error('INVALID_POLL_END_DATE');        

    // this way over posting is prevented
    // here the requiered fields are EXPLICITLY declared
    const patchData = {
      ...(typeof pollPatch.name !== 'undefined' && {name: pollPatch.name}),
      ...(typeof pollPatch.isOpen !== 'undefined' && {isOpen: pollPatch.isOpen}),
      ...(typeof pollPatch.endsAt !== 'undefined' && !isNaN(new Date(pollPatch.endsAt).getDate()) && {endsAt: new Date(pollPatch.endsAt)})
    };

    // tokens are removed when the poll is changed from open to close.
    if (typeof patchData.isOpen !== 'undefined') {
      const moviesInPollCount = await prisma.moviePoll.count({where: {pollId: pollId}});

      if (!patchData.isOpen && moviesInPollCount <= 1) {
        throw new Error('MIN_NUMBER_MOVIES_POLL');
      }

      const deletedTokens = prisma.token.deleteMany({where: {pollId: pollId}});
      const resetVotes = prisma.moviePoll.updateMany({
        where: {pollId: pollId},
        data: {voteCount: 0}
      });
      const patchedPoll = prisma.poll.update({
        where: {id: pollId},
        data: patchData    
      });

      // check returned value when transaction fails
      const transaction = await prisma.$transaction([resetVotes, deletedTokens, patchedPoll]);

      return transaction[2];
    }

    const patchedPoll = await prisma.poll.update({
      where: {id: pollId},
      data: patchData
    });

    return getPollVMWithoutMoviesAndTokens(patchedPoll);
  }

  /**
   * Gets the details of a Poll Author.
   * @param pollId the id of the Poll
   * @returns A Promise with the Poll Author's details
   */
  static async getPollOwner(pollId: number): Promise<{
    name: string | undefined,
    photoURL: string | undefined,
    uid: string
  }> {
    const res = await prisma.poll.findFirst({where: {id: pollId}, select: {userId: true}});

    if (!res || !res.userId)
      throw new Error('POLL_NOT_FOUND');

    const fbUser = await admin.auth().getUser(res.userId);

    const user = {
      name: fbUser.displayName,
      photoURL: fbUser.photoURL,
      uid: fbUser.uid
    };

    return user;
  }

  /**
   * Creates a Token and adds it to a Poll
   * @param pollId The Poll id
   * @param userId The user UUID currently authenticated
   * @returns a Promise of a Token object
   */
  static async createToken(pollId: number, userId: string): Promise<Token> {
    const poll = await prisma.poll.findFirst({
      include: {tokens: true},
      where: {id: pollId, AND: {userId: userId}}
    });

    if (!poll)
      throw new Error('POLL_NOT_FOUND');

    if (poll.tokens.length >= 50)
      throw new Error('MAX_TOKEN_REQUEST_LIMIT_REACHED');

    if (poll.isOpen)
      throw new Error('OPENED_POLL');
    
    const uuid = uuid4();
    
    const token = await prisma.token.create({
      data: {uuid: uuid, pollId: pollId}
    });

    return token;
  }

  /**
   * Removes a Token object linked to a Poll.
   * @param pollId The Poll id
   * @param tokenId The Token uuid
   * @param userId The user's uuid
   * @returns A Promise of a Token object removed.
   */
  static async removeToken(pollId: number, tokenId: string, userId: string): Promise<Token> {
    const poll = await prisma.poll.findFirst({
      where: {
        id: pollId, 
        AND: {
          userId: userId, 
          tokens: {some: {uuid: tokenId}}
        }
      }
    });
    
    if (!poll)
      throw new Error('POLL_OR_TOKEN_NOT_FOUND');

    const token = await prisma.token.findUnique({where: {uuid: tokenId}});

    if (!token || token.used)
      throw new Error('TOKEN_NOT_FOUND_OR_TOKEN_ALREADY_USED'); 

    const res = await prisma.token.delete({where: {uuid: tokenId}});

    return res;
  }

  /**
   * Gets a public poll. 
   * @param pollId the poll id
   * @param tokenId the token id
   * @returns A Promise of a Poll with all its content(movies, the token used, etc)
   */
  static async getPublicPoll(pollId: number, tokenId: string): Promise<any> {
    const poll = await prisma
      .poll
      .findFirst({
        include: {movies: true}, // DOT NOT INCLUDE TOKENS HERE!!!
        where: {id: pollId, AND: {isOpen: false, tokens: {some: {uuid: tokenId}}}}
      });
    
    const token = await prisma.token.findUnique({where: {uuid: tokenId}});

    if (!poll || !token)
      throw new Error('POLL_OR_TOKEN_NOT_FOUND');

    const tokenQty = await prisma.token.count({where: {pollId: pollId}});

    const res = {
      ...poll,
      movies: await Promise.all(poll.movies.map(async movie => {
        return {
          ...movie,
          movie: await MoviesService.fetchMovieDetails(movie.movieId).then(async res => {
            return {
              ...res,
              genre_names: res.genres.map(genre => genre.name),
              providers: await MoviesService.fetchMovieProviders(movie.movieId)
            };
          })
        }
      })),
      tokens: [token], // MUST ALWAYS RETURN JUST TOKEN BEING USED NOT ALL OF THEM.
      tokenQty: tokenQty
    };

    return res;
  }

  /**
   * Set a vote for a movie in a poll.
   * @param pollId the Poll's Id
   * @param tokenId The token id
   * @param movieId The movie id
   * @returns a Promise of movie object with a token object
   */
  static async setVote(pollId: number, tokenId: string, movieId: number): Promise<{
    movie: MoviePoll,
    token: Token
  }> {
    const moviesInPoll = await prisma.poll.findFirst({
      where: {
        id: pollId, 
        AND: {
          isOpen: false, 
          tokens: {
            some: {uuid: tokenId, AND: {used: false}}
          },
          movies: {
            some: {movieId: movieId}
          },
          endsAt: {gt: new Date()}
        }
      },
      select: {movies: {where: {movieId: movieId}}}
    });

    if (!moviesInPoll || moviesInPoll.movies.length !== 1)
      throw new Error('OBJECT_NOT_FOUND');

    const token = prisma.token.update({
      where: {uuid: tokenId},
      data: {used: true}
    });

    const movieInPoll = moviesInPoll.movies[0];

    const movie = prisma.moviePoll.update({
      where: {pollId_movieId: {pollId: pollId, movieId: movieId}},
      data: {voteCount: movieInPoll.voteCount + 1}
    });

    const transaction = await prisma.$transaction([token, movie]);

    return {
      movie: transaction[1],
      token: transaction[0]
    };
  }
}