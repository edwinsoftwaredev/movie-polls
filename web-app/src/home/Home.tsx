import React, { useEffect, useState } from 'react';
import MovieCardCarousel from '../shared/movie-card-carousel/MovieCardCarousel';
import style from './Home.module.scss';
import Axios, { AxiosResponse } from 'axios';
import { IGenreRequest, IMovie, IMovieRequest } from '../shared/interfaces/movie-types';

const Home: React.FC = () => {
  const [top10Movies, setTop10Movies] = useState<IMovie[]>([]);

  useEffect(() => {
    const nowDate = new Date(Date.now());
    const previousYear = new Date(nowDate.setFullYear(nowDate.getFullYear() - 1));
    Axios.get(
      `${process.env.REACT_APP_TMDB_API_URL}/genre/movie/list`,
      {
        params: {
          api_key: process.env.REACT_APP_TMDB_API_KEY
        }
      }
    ).then((response: AxiosResponse<IGenreRequest>) => {
      const genres = response.data.genres;
      const getList = async () => {
        const tempList: IMovie[] = [];
        let pageNum = 1;
        while (pageNum <= 500) {
          const pageResponse = await Axios.get<IMovieRequest>(
            `${process.env.REACT_APP_TMDB_API_URL}/movie/popular`,
            {
              params: {
                api_key: process.env.REACT_APP_TMDB_API_KEY,
                page: pageNum
              }
            }
          );

          const pageFiltered = pageResponse.data.results
            .filter(movie => (
                new Date(movie.release_date) >= previousYear
              )
            )
            .map((movie, index) => (
              {
                ...movie,
                genre_names: movie.genre_ids.map(id => genres.find((genre) => genre.id === id)?.name ?? ''),
                key: index
              }
            ));

          tempList.push(...pageFiltered);
          pageNum++;
        }

        // console.log(tempList.slice(0, 10)); <- use this to fetch the top 10 popular movies

        const sortedByVoteCount = tempList
          .filter(movie => (movie.vote_count >= 1000 && movie.vote_average >= 7))
          .sort((a, b) => b.vote_count - a.vote_count)
          .slice(0, 10)
          .sort((a, b) => b.vote_average - a.vote_average);

        return sortedByVoteCount;
      }

      getList().then(list => setTop10Movies(list));
    });
  }, []);

  return (
    <div className={style['home-component']}>
      <MovieCardCarousel movieList={top10Movies} title='Top 10 Best Popular Movies'/>
    </div>
  );
};

export default Home;