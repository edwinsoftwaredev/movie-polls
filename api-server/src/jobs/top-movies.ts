import prisma from '../prisma-client';
import schedule from 'node-schedule';
import MoviesService from '../services/movie-service';

// this job is executed every 24 hours
export const topMoviesJob = schedule.scheduleJob('* * */24 * * *', async () => {
  const cache = await prisma.topMovies.findFirst();

  if (cache) {
    const today = new Date().setHours(0, 0, 0, 0);
    const cacheDate = cache.updateDate.setHours(0, 0, 0, 0);

    if (today - cacheDate > 0) {
      console.log('Updating TopMovies cache.');
      const topMovies = await MoviesService.fetchTopMovies_Job();
      const topMoviesObject: any = {result: topMovies};

      await prisma.topMovies.update({
        where: {id: cache.id}, 
        data: {topMovies: topMoviesObject}
      });
      console.log('TopMovies cache updated.');
    }
  } else {
    console.log('Caching top movies.');
    const topMovies = await MoviesService.fetchTopMovies_Job();
    const topMoviesObject: any = {result: topMovies};
    const updateDate = new Date(new Date().setHours(0, 0, 0, 0));

    await prisma.topMovies.create({
      data: {id: 1, topMovies: topMoviesObject, updateDate: updateDate}
    });
    console.log('TopMovies cached');
  }
});