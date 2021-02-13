import React, { useEffect, useState } from 'react';
import MovieCardCarousel from '../shared/movie-card-carousel/MovieCardCarousel';
import style from './Home.module.scss';
import Axios, { AxiosResponse } from 'axios';
import { IGenreRequest, IMovie, IMovieRequest } from '../shared/interfaces/movie-types';

const Home: React.FC = () => {
  const [top10Movies, setTop10Movies] = useState<IMovie[]>([]);

  useEffect(() => {
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
        while (tempList.length < 10) {
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
                movie.vote_count > 2500 &&
                movie.vote_average >= 7 &&
                new Date(movie.release_date) >= new Date(new Date(Date.now()).setFullYear(new Date(Date.now()).getFullYear() - 1))
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

        return tempList;
      }

      getList().then(list => setTop10Movies(list.sort((a, b) => b.vote_average - a.vote_average).slice(0, 10)))
    });
  }, []);

  return (
    <div className={style['home-component']}>
      <MovieCardCarousel movieList={top10Movies} title='Top 10 Movies'/>
    </div>
  );
};

export default Home;