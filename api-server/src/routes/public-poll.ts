import Koa from 'koa';
import Router from "@koa/router";
import PollService from '../services/poll-service';

const router = new Router<Koa.DefaultState, Koa.DefaultContext>();

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

router.get('/poll/:id', async (ctx, next) => {
  const pollId = Number.parseInt(ctx.params.id);
  const tokenId = ctx.query.tid;

  if (isNaN(pollId) || typeof tokenId === 'object') {
    console.error('Reason: Invalid path or query parameter');
    ctx.throw(400);
    return;
  }

  if (typeof tokenId === 'undefined') {
    return await next();
  }

  const res = await PollService.getPublicPoll(pollId, tokenId);

  ctx.status = 200;
  ctx.body = res;
});

router.patch('/poll/:id/vote', async (ctx, next) => {
  const pollId = Number.parseInt(ctx.params.id);
  const body: {tokenId: string, movieId: number} | undefined = ctx.request.body;

  if (isNaN(pollId)) {
    console.error('Bad Request. Reason: one or more request parameters are not valid.');
    ctx.throw(400);
  }

  if (!body){
    console.log('Bad Request. Reason: Request body is not valid.');
    ctx.throw(400);
  } else {
    const res = await PollService.setVote(pollId, body.tokenId, body.movieId).catch((reason: Error) => {
      console.error(`An Error occurred when setVote was executed. Reason: ${reason.message}`);
      ctx.throw(500);
    });
    ctx.status = 200;
    ctx.body = res;
  }
});

export default router;