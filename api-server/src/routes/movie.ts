import Koa from 'koa';
import Router from '@koa/router';
import { AxiosError } from 'axios';
import MoviesService from '../services/movie-service';

const router = new Router<Koa.DefaultState, Koa.DefaultContext>();

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
  const movies = await MoviesService.fetchNowPlayingMovies().catch((error: AxiosError | Error) => {
    console.error(`Error when fetching now playing movies. Message: ${error.message}`);
    ctx.throw(500);
  });

  ctx.body = movies;
  ctx.status = 200;
});

router.get('/trending-movies', async (ctx, next) => {
  const result = await MoviesService.fetchTrendingMoviesByGenres().catch((error: AxiosError | Error) => {
    console.error(`Error when fetchin trending movies. Message: ${error.message}`);
    ctx.throw(500);
  });

  ctx.body = result;
  ctx.status = 200;
});

router.get('/top-movies-year', async (ctx, next) => {
  const year = ctx.query.year;
  if (year && typeof year === 'string') {
    const result = await MoviesService.fetchTopMoviesByGenresAndYear(year).catch((error: AxiosError | Error) => {
      console.log(`Error when fetching top movies by year. Message: ${error.message}`);
      ctx.throw(500);
    });

    ctx.body = result;
    ctx.status = 200;
  } else {
    ctx.throw(400);
  }
});

router.get('/genres', async (ctx, next) => {
  const result = await MoviesService.fetchGenres().catch((error: AxiosError | Error) => {
    console.log(`Error when fetching genres. Message: ${error.message}`);
    ctx.throw(500);
  });

  ctx.body = result;
  ctx.status = 200;
});

export default router;