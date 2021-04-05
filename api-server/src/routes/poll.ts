import Koa from 'koa';
import Router from '@koa/router';
import PollService from '../services/poll-service';
import { PollVM } from '../shared/type-interfaces/movie-poll-types';

const router = new Router<Koa.DefaultState, Koa.DefaultContext>({prefix: '/polls'});

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
  const opened = ctx.query.opened === 'true' ? true : false;
  const res = await PollService.getPollsByUserAndOpenedStatus(ctx.userId, opened).catch((error: Error) => {
    console.log(`An error occurred when getOpenPollsByUser was executed. Message: ${error.message}`);
    ctx.throw(500);
  });

  ctx.status = 200;
  ctx.body = res;
});

export default router;