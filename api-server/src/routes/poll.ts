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

router.delete('/movie/:id', async (ctx, next) => {
  const movieId = Number.parseInt(ctx.params.id);
  const pollId =
    ctx.query.pollId && typeof ctx.query.pollId === 'string' ? 
      Number.parseInt(ctx.query.pollId) : NaN;
  if (isNaN(movieId) || isNaN(pollId)) {
    console.error('Bad request when deleting movie. Reason: movie id or poll id are not valid.');
    ctx.throw(400);
  }

  const res = await PollService.removeMovie(pollId, movieId, ctx.userId).catch((error: Error) => {
    console.log(`An error occurred when removeMovie was executed. Reason: ${error.message}`);
    ctx.throw(500);
  });

  ctx.body = res;
  ctx.status = 200;
});

router.delete('/poll/:id', async (ctx, next) => {
  const pollId = Number.parseInt(ctx.params.id);
  if (isNaN(pollId)) {
    console.error('Bad request when DELETE method was executed. Reason: Invalid parameter.');
    ctx.throw(400);
  }

  const res = await PollService.removePoll(pollId, ctx.userId).catch((error: Error) => {
    console.error(`An Error occurred when removePoll was executed. Reason: ${error.message}`);
    ctx.throw(500);
  });

  ctx.body = res;
  ctx.status = 200;
});

export default router;