import Koa from 'koa';
import KoaLogger from 'koa-logger';
import Router from '@koa/router';
import {default as initControllers} from './routes/init';


const app = new Koa();
const router = new Router();

initControllers(router);

app.use(KoaLogger());
app.use(router.routes());

app.use(async ctx => {
  ctx.body = 'Hello World!';
});

app.listen(4000);