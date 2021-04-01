import dotenv from 'dotenv';
 
if (process.env.NODE_ENV !== 'production') {
  // loads env var in .env file
  dotenv.config();
}

import {moviesJob} from './jobs/movies';
// this will execute immediatly the job
moviesJob.invoke();

import Koa from 'koa';
import KoaLogger from 'koa-logger';
import Router from '@koa/router';
import cors from '@koa/cors';
import session from 'koa-session'
import prisma from './prisma-client';
import * as admin from 'firebase-admin';

import {default as initRoutes} from './routes/init';
import bodyParser from 'koa-bodyparser';

/** Apps initialization block **/
const app = new Koa();
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});
/******************************/

app.keys = [process.env.KEY as string];

const router = new Router<Koa.DefaultState, Koa.DefaultContext>();
const corsConfig: cors.Options = {origin: process.env.CLIENT_ORIGIN, credentials: true};

const sessionConfig: Partial<session.opts> = {
  store: {
    async get(key, maxAge, data) {
      // TODO: Errors should be catched.
      const sessionObj = await prisma.session.findUnique({
        where: {id: key}
      });
      return sessionObj?.session;
    },
    async set(key, sess, maxAge, data) {
      // TODO: Errors should be catched.
      await prisma.session.upsert({
        where: {id: key},
        update: {session: sess},
        create: {id: key, session: sess}
      })
    },
    async destroy(key){
      // TODO: Errors should be catched.
      await prisma.session.delete({where: {id: key}})
    }
  }
};

// custom context attributes
app.context.userId = '';

initRoutes(router);

app.use(KoaLogger());
app.use(cors(corsConfig));
app.use(session(sessionConfig, app)); // Prefer a store like Redis - MySql is in used.
app.use(bodyParser());
app.use(router.routes());

app.listen(process.env.PORT);