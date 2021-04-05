import Router from "@koa/router";
import CSRF from 'koa-csrf';
import csrfTokenRouter from './csrf_token';
import movieRouter from './movie';
import pollRouter from './poll';
import Koa from 'koa';
import * as admin from 'firebase-admin';

const csrfMiddleware = new CSRF({
  invalidTokenMessage: 'Invalid CSRF token',
  invalidTokenStatusCode: 403,
  // excludedMethods: [ 'GET', 'HEAD', 'OPTIONS' ],
  excludedMethods: [ 'HEAD', 'OPTIONS' ],
  disableQuery: false
});

// this is used by the csrf_token endpoint.
// by using this extra token middleware it is possible
// to protect GET requests in others routers that use 
// others CSRF middleware and to disable csrf token validation 
// of GET request in the csrf_token endpoint.
const csrfMiddlewareGenerator = new CSRF({
  invalidTokenMessage: 'Invalid CSRF token',
  invalidSessionSecretStatusCode: 403,
  excludedMethods: ['GET', 'HEAD', 'OPTIONS'],
  disableQuery: false
});

const firebaseTokenValidatorMiddleware = async (
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>,
  next: Koa.Next
) => {
  const idToken = ctx.header.authorization?.split('Bearer ')[1];
  // check if authorization header and Bearer token are present
  if (!idToken) {
    ctx.status = 401;
    return;
  }
  
  const idTokenDecoded = await admin.auth().verifyIdToken(idToken)
    .catch(reason => {
      console.warn(`Firebase IdToken validation failed. From: ${ctx.ip}, Destination: ${ctx.url}`);
      ctx.throw(401);
    });

  if (idTokenDecoded) {
    ctx.userId = idTokenDecoded.uid;
    await next();
  }
};

const init = (router: Router<Koa.DefaultState, Koa.DefaultContext>): void => {
  // The order of this middleware list
  // is based on the level of protection determined 
  // for each route in ascending order.

  // Always use a unique prefix for each router.
  // Doing that will prevent the execution of middlewares used for multiple routers
  // beign called multiple times in a single request.
  //
  // '/api/csrf-token', '/api/movies' and '/api/polls' are the unique prefixes 
  // If these prefixes were all setted just like '/api', which is not OK, the firebaseTokenValidatorMiddleware
  // will be called more than once because the middleware is placed before the nested routes.
  router.use('/api/csrf-token', csrfMiddlewareGenerator, csrfTokenRouter.routes(), csrfTokenRouter.allowedMethods());
  router.use('/api/movies', csrfMiddleware, firebaseTokenValidatorMiddleware, movieRouter.routes(), movieRouter.allowedMethods());
  router.use('/api/polls', csrfMiddleware, firebaseTokenValidatorMiddleware, pollRouter.routes(), pollRouter.allowedMethods());
};

export default init;