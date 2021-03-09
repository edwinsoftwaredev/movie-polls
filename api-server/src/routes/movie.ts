import Koa from 'koa';
import Router from '@koa/router';

const router = new Router<Koa.DefaultState, Koa.DefaultContext>({prefix: '/movies'});

router.get('/top-movies', (ctx, next) => {
  ctx.status = 200;
});

export default router;