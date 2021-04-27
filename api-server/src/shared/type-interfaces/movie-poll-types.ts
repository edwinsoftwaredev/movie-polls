import { Prisma, Token } from ".prisma/client";
import { IMovie } from "./movie-types";
import { Poll as PrismaPoll } from ".prisma/client";

export type Poll = Prisma.PollGetPayload<{
  include: {movies: true, tokens: true}
}>;

export interface PollVM extends Omit<Poll, 'movies' | 'userId'> {
  movies: {
    movieId: number,
    movie?: IMovie,
    voteCount: number,
  }[];
}

export type PollInput = Prisma.PollCreateInput;

export const getPollVMFromPoll = (poll: Poll): PollVM => {
  return {
    createdAt: poll.createdAt,
    endsAt: poll.endsAt,
    id: poll.id,
    isOpen: poll.isOpen,
    movies: poll.movies,
    name: poll.name,
    tokens: poll.tokens
  }
}

export const getPollVMWithoutMoviesAndTokens = (poll: PrismaPoll): Omit<PollVM, 'movies' | 'tokens'> => {
  return {
    createdAt: poll.createdAt,
    endsAt: poll.endsAt,
    id: poll.id,
    isOpen: poll.isOpen,
    name: poll.name
  };
}

export interface IPoll_PATCH {
  name?: string;
  isOpen?: boolean;
  endsAt?: Date;
}