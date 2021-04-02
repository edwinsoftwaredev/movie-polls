import { getPollVMFromPoll, PollInput, PollVM } from "../shared/type-interfaces/movie-poll-types";
import prisma from '../prisma-client';
import { Prisma } from ".prisma/client";
import { getMovieFromMovieDetails } from "../shared/type-interfaces/movie-types";
import MoviesService from "./movie-service";

export default class PollService {
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
		console.log(movie);

		console.log(pollResult);

		return pollResult;
	}
}