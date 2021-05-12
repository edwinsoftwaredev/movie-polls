import prisma from '../prisma-client';

export default class AccountService {
  static async deleteAccount(userId: string): Promise<void> {
    const polls = (await prisma.poll.findMany({where: {userId: userId}}))
      .map(poll => poll.id);

    if (polls.length === 0)
      return;

    const t1 = prisma.token.deleteMany({where: {pollId: {in: polls}}});
    const t2 = prisma.moviePoll.deleteMany({where: {pollId: {in: polls}}});
    const t3 = prisma.poll.deleteMany({where: {id: {in: polls}}});

    await prisma.$transaction([t1, t2, t3]);
    return;
  }
}