import Koa from 'koa';
import Router from '@koa/router';

// IMPORTANT!
// always set the generic types when using Router
// to get the AUGMENTED state and context
const router = new Router<Koa.DefaultState, Koa.DefaultContext>({
  methods: ['GET']
});

router.get('/csrf-token', async (
  ctx,
  next
) => {
  if (ctx.session)
    // the CSRF middleware will look for the
    // XSRF-Token header and compare it with 
    // the value setted in ctx.session.csrf
    ctx.session.csrf = ctx.csrf;

  // by default cookies are protected from tampering when 'signed' is set to true
  ctx.cookies.set(
    'XSRF-TOKEN',
    ctx.session?.csrf,
    {httpOnly: false, signed: false}
  );

  ctx.status = 204;
});

export default router;