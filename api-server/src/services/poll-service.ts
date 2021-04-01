import { Poll, PollInput } from "../shared/type-interfaces/movie-poll-types";
import prisma from '../prisma-client';

export default class PollService {
	static async createPoll(poll: Poll): Promise<void> {
		const data: PollInput = {
			...poll,
			movies: poll.movies ? {create: poll.movies} : undefined,
			tokens: poll.tokens ? {create: poll.tokens} : undefined
		};

		await prisma.poll.create({
			data: data,
			include: {movies: true, tokens: true}
		});
	}
}