import Koa from 'koa';
import Router from '@koa/router';
import { AxiosError } from 'axios';
import MoviesService from '../services/movie-service';

const router = new Router<Koa.DefaultState, Koa.DefaultContext>({prefix: '/movies'});

router.get('/top-movies', async (ctx, next) => {
  const topMovies = await MoviesService.fetchTopMovies().catch((error: AxiosError | Error) => {
    console.error(`Error when fetching Top Movies. Message: ${error.message}`);
    ctx.throw(500);
  });

  ctx.body = topMovies;
  ctx.status = 200;
});

router.get('/movie-details', async (ctx, next) => {
  const idString = ctx.query.id;
  if (typeof idString === 'string' && ctx.query.id) {
    const id = Number.parseInt(idString);
    ctx.body = await MoviesService.fetchMovieDetails(id).catch((err: AxiosError | Error) => {
      console.log(`Error when fetching movie details. Message: ${err.message}`);
      ctx.throw(500);
    });
    ctx.status = 200;
  } else {
    ctx.status = 400;
  }
});

export default router;