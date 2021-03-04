import dotenv from 'dotenv';
 
if (process.env.NODE_ENV !== 'production') {
  // loads env var in .env file
  dotenv.config();
}

import Koa from 'koa';
import KoaLogger from 'koa-logger';
import Router from '@koa/router';
import cors from '@koa/cors';

import {default as initRoutes} from './routes/init';

const app = new Koa();
const router = new Router();

initRoutes(router);

app.use(KoaLogger());
app.use(cors());
app.use(router.routes());

app.listen(process.env.PORT);