import prisma from '../prisma-client';
import schedule from 'node-schedule';
import MoviesService from '../services/movie-service';
import { MoviesTypes } from '../shared/cache-movie-types';

const rule = new schedule.RecurrenceRule();
rule.minute = 0; // this will schedule to execute the job every hour at minute 0

// this job is executed every hours
export const moviesJob = schedule.scheduleJob(rule, async () => {
  console.info('Executing MoviesJob');
  const today = new Date().setHours(0, 0, 0, 0);

  const updateByType = async (type: MoviesTypes) => {
    const cache = await prisma.bestMovies.findFirst({where: {type: type}});

    if (cache) {
      const cacheDate = cache.updateDate.setHours(0, 0, 0, 0);
  
      if (today - cacheDate > 0) {
        console.info(`Updating ${type} movies cache.`);
        const bestMovies = await MoviesService.fetchMoviesByType_Job(type);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const object: any = {result: bestMovies};
  
        await prisma.bestMovies.update({
          where: {id: cache.id}, 
          data: {movies: object, updateDate: new Date(today), type: type}
        });

        console.info(`${type} movies cache updated.`);
      }
    } else {
      console.log(`Caching ${type} movies.`);
      const bestMovies = await MoviesService.fetchMoviesByType_Job(type);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const object: any = {result: bestMovies};
      const updateDate = new Date(new Date().setHours(0, 0, 0, 0));
  
      await prisma.bestMovies.create({
        data: {movies: object, updateDate: updateDate, type: type}
      });

      console.log(`${type} movies cached.`);
    }
  }

  await updateByType(MoviesTypes.TopPopularMovies);
  await updateByType(MoviesTypes.TopTrendingMovies);
  await updateByType(MoviesTypes.NowPlayingMovies);

  console.log('Movies cache is updated.');
});