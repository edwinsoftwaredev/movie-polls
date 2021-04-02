import { Poll, PollInput } from "../shared/type-interfaces/movie-poll-types";
import prisma from '../prisma-client';
import { Prisma } from ".prisma/client";

export default class PollService {
	static async createPoll(poll: Poll, userId: string): Promise<Poll> {
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

		return res;
	}
}