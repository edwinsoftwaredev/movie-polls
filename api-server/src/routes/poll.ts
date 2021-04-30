import Koa from 'koa';
import Router from '@koa/router';
import PollService from '../services/poll-service';
import { IPoll_PATCH, PollVM } from '../shared/type-interfaces/movie-poll-types';

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

router.patch('/poll/:id', async (ctx, next) => {
  const pollId = Number.parseInt(ctx.params.id);
  const pollPatch: IPoll_PATCH = ctx.request.body;

  if (isNaN(pollId)) {
    console.error('Bad request when PATCH method was executed. Reason: Invalid parameter');
    ctx.throw(400);
  }

  const res = await PollService.patchPoll(pollId, pollPatch, ctx.userId).catch((error: Error) => {
    console.error(`An Error occurred when removePoll was executed. Reason: ${error.message}`);
    ctx.throw(500);
  });

  ctx.body = res;
  ctx.status = 200;
});

router.get('/poll/:id/author', async (ctx, next) => {
  const pollId = Number.parseInt(ctx.params.id);
  if (isNaN(pollId)) {
    console.error('Bad request when GET method was executed. Reason: Invalid parameter');
    ctx.throw(400);
  }

  const author = await PollService.getPollOwner(pollId).catch((error: Error) => {
    console.error(`An error occurred when getPollOwner was executed. Reason: ${error.message}`);
    ctx.throw(500);
  });

  ctx.body = author;
  ctx.status = 200;
});

router.post('/poll/:id/token', async (ctx, next) => {
  const pollId = Number.parseInt(ctx.params.id);

  if (isNaN(pollId)) {
    console.error('Bad request when POST method was executed. Reason: Invalid parameter');
    ctx.throw(400);
  }

  const res = await PollService.createToken(pollId, ctx.userId);

  ctx.body = res;
  ctx.status = 200;
});

router.delete('/poll/:id/:token', async (ctx, next) => {
  const pollId = Number.parseInt(ctx.params.id);
  const tokenId = ctx.params.token;

  if (isNaN(pollId) || !tokenId) {
    console.error('Bad request when DELETE method was executed. Reason: Invalid parameters');
    ctx.throw(400);
  }

  const res = await PollService.removeToken(pollId, tokenId, ctx.userId);

  ctx.body = res;
  ctx.status = 200;
});

export default router;