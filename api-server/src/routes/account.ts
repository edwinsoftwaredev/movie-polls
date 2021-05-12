import Koa from 'koa';
import Router from '@koa/router';
import AccountService from '../services/account-service';

const router = new Router<Koa.DefaultState, Koa.DefaultContext>();

router.post('/delete', async (ctx, next) => {
  await AccountService.deleteAccount(ctx.userId);
  ctx.status = 204;
});

export default router;