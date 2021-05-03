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

export default router;