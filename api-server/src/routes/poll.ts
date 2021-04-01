import Koa from 'koa';
import Router from '@koa/router';
import PollService from '../services/poll-service';
import { Poll } from '../shared/type-interfaces/movie-poll-types';

const router = new Router<Koa.DefaultState, Koa.DefaultContext>({prefix: '/polls'});

router.post('/poll', async (ctx, next) => {
  const poll: Poll = ctx.request.body;
  await PollService.createPoll(poll).catch((err: Error) => {
    console.log(`There was an error when createPoll was executed. Message: ${err.message}`);
    ctx.throw(500);
  });

  ctx.status = 201;
});

export default router;