import dotenv from 'dotenv';
 
if (process.env.NODE_ENV !== 'production') {
  // loads env var in .env file
  dotenv.config();
}

import Koa from 'koa';
import KoaLogger from 'koa-logger';
import Router from '@koa/router';
import cors from '@koa/cors';
import session from 'koa-session'

import {default as initRoutes} from './routes/init';

const app = new Koa();

app.keys = [process.env.KEY as string];

const router = new Router();
const corsConfig: cors.Options = {origin: process.env.CLIENT_ORIGIN}

initRoutes(router);

app.use(KoaLogger());
app.use(session(app)); // client side session -> TODO: use a proper store
app.use(cors(corsConfig));
app.use(router.routes());

app.listen(process.env.PORT);