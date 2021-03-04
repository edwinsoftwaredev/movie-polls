import Router from "@koa/router";
import {default as authRoutes} from './auth';

const init = (router: Router): void => {
  router.use('/api', authRoutes.routes(), authRoutes.allowedMethods());
};

export default init;