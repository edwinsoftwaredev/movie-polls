import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopMovies } from '../services/epics/top-movies';
import { topMoviesSelector } from '../services/slices-selectors/top-movies';
import FiltersBar from '../shared/filters-bar/FiltersBar';
import MovieCarousel from '../shared/movie-card-carousel/MovieCardCarousel';
import style from './TopMovies.module.scss';

const TopMovies: React.FC = () => {
  const dispatch  = useDispatch();
  const topMovies = useSelector(topMoviesSelector);
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const yearFilterClbk = (year: string) => {
    setYear(year);
  }

  useEffect(() => {
    dispatch(fetchTopMovies({year: year}));
  }, [year, dispatch]);

  return (
    <div className={style['topmovies-component']}>
      <FiltersBar callbackYear={yearFilterClbk}/>
      <div id='sliders-container' className={style['sliders-container']}>
        {
          topMovies.map((item, idx) => (
            <Fragment key={idx}>
              <MovieCarousel title={item.genre_name} movieList={item.results}/>
            </Fragment>
          ))
        }
      </div>
    </div>
  );
};

export default TopMovies;