import Router from "@koa/router";
import CSRF from 'koa-csrf';
import authRouter from './auth';
import csrfTokenRouter from './csrf_token';

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

const init = (router: Router): void => {
  // The order of this middleware list
  // is based on the level of protection determined 
  // for each route in ascending order.
  router.use('/api', csrfMiddlewareGenerator, csrfTokenRouter.routes(), csrfTokenRouter.allowedMethods());
  router.use('/api', csrfMiddleware, authRouter.routes(), authRouter.allowedMethods());
};

export default init;