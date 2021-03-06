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
import {PrismaClient} from '@prisma/client';

import {default as initRoutes} from './routes/init';

const app = new Koa();
const prisma = new PrismaClient();

app.keys = [process.env.KEY as string];

const router = new Router();
const corsConfig: cors.Options = {origin: process.env.CLIENT_ORIGIN};

const sessionConfig: Partial<session.opts> = {
  store: {
    async get(key, maxAge, data) {
      // TODO: Errors should be catched.
      const sessionObj = await prisma.session.findUnique({
        where: {id: key}
      }).finally(() => prisma.$disconnect());
      return sessionObj?.session;
    },
    async set(key, sess, maxAge, data) {
      // TODO: Errors should be catched.
      await prisma.session.upsert({
        where: {id: key},
        update: {session: sess},
        create: {id: key, session: sess}
      }).finally(() => prisma.$disconnect());
    },
    async destroy(key){
      // TODO: Errors should be catched.
      await prisma.session.delete({where: {id: key}})
        .finally(() => prisma.$disconnect());
    }
  }
};

initRoutes(router);

app.use(KoaLogger());
app.use(session(sessionConfig, app)); // client side session -> Use a proper store like Redis
app.use(cors(corsConfig));
app.use(router.routes());

app.listen(process.env.PORT);