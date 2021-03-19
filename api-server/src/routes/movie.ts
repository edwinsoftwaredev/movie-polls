import Koa from 'koa';
import Router from '@koa/router';
import { AxiosError } from 'axios';
import MoviesService from '../services/movie-service';

const router = new Router<Koa.DefaultState, Koa.DefaultContext>({prefix: '/movies'});

router.get('/top-popular-movies', async (ctx, next) => {
  const movies = await MoviesService.fetchTopPopularMovies().catch((error: AxiosError | Error) => {
    console.error(`Error when fetching top popular movies. Message: ${error.message}`);
    ctx.throw(500);
  });

  ctx.body = movies;
  ctx.status = 200;
});

router.get('/movie-details/:id', async (ctx, next) => {
  const idString = ctx.params.id;
  if (idString) {
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

router.get('/top-trending-movies', async (ctx, next) => {
  const movies = await MoviesService.fetchTopTrendingMovies().catch((error: AxiosError | Error) => {
    console.error(`Error when fetching top trending movies. Message: ${error.message}`);
    ctx.throw(500);
  });

  ctx.body = movies;
  ctx.status = 200;
});

router.get('/now-playing', async (ctx, next) => {
  const movies = await MoviesService.fetchNowPlayingMovies_job().catch((error: AxiosError | Error) => {
    console.error(`Error when fetching now playing movies. Message: ${error.message}`);
    ctx.throw(500);
  });

  ctx.body = movies;
  ctx.status = 200;
});

export default router;