import Koa from 'koa';
import Router from '@koa/router';
import PollService from '../services/poll-service';
import { PollVM } from '../shared/type-interfaces/movie-poll-types';

const router = new Router<Koa.DefaultState, Koa.DefaultContext>();

router.post('/poll', async (ctx, next) => {
  const poll: PollVM = ctx.request.body;
  const res = await PollService.createPoll(poll, ctx.userId).catch((err: Error) => {
    console.log(`There was an error when createPoll was executed. Message: ${err.message}`);
    ctx.throw(500);
  });

  ctx.status = 201;
  ctx.body = res;
});

router.get('/my-polls', async (ctx, next) => {
  const res = await PollService.getPollsByUser(ctx.userId).catch((error: Error) => {
    console.log(`An error occurred when getOpenPollsByUser was executed. Message: ${error.message}`);
    ctx.throw(500);
  });

  ctx.status = 200;
  ctx.body = res;
});

router.post('/add-movie', async (ctx, next) => {
  const data: {pollId: string, movieId: string} = ctx.request.body;
  const pollId = Number.parseInt(data.pollId);
  const movieId = Number.parseInt(data.movieId);
  if (isNaN(pollId) || isNaN(movieId))
    ctx.throw(500);

  const res = await PollService.addMovie(pollId, movieId, ctx.userId).catch((error: Error) => {
    console.log(`An error accurred when addMovieToPoll was executed: Message: ${error.message}`);
    ctx.throw(500);
  });

  ctx.status = 200;
  ctx.body = res;
}); 

export default router;