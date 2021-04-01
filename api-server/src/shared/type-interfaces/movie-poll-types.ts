import { Prisma } from ".prisma/client";

export type Poll = Prisma.PollGetPayload<{
  include: {movies: true, tokens: true}
}>;

export type PollInput = Prisma.PollCreateInput;