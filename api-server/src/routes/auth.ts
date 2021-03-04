import Router from '@koa/router';

const router = new Router({
  prefix: '/auth'
});

// rememeber to define router methods

router.get('/validate-token', async (ctx, next) => {
  console.log(ctx.URL);
  console.log(next);
  ctx.body = 'Validating token...';
});

export default router;
