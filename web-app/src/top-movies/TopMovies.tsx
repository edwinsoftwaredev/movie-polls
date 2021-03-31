import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopMovies } from '../services/epics/top-movies';
import { setInitialTopMovies, topMoviesSelector } from '../services/slices-selectors/top-movies';
import FiltersBar from '../shared/filters-bar/FiltersBar';
import MovieCarousel from '../shared/movie-card-carousel/MovieCardCarousel';
import style from './TopMovies.module.scss';

const TopMovies: React.FC = () => {
  const dispatch  = useDispatch();
  const topMovies = useSelector(topMoviesSelector);
  const currentYear = new Date().getFullYear().toString();
  const initYear = topMovies.filters.year ? topMovies.filters.year : currentYear;
  const [year, setYear] = useState(initYear);

  const yearFilterClbk = (year: string) => {
    dispatch(setInitialTopMovies());
    setYear(year);
  }

  useEffect(() => {
    dispatch(fetchTopMovies({year: year}));
  }, [year, dispatch]);

  return (
    <div className={style['topmovies-component']}>
      <div id='sliders-container' className={style['sliders-container']}>
        <FiltersBar callbackYear={yearFilterClbk} intialYear={topMovies.filters.year}/>
        {
          topMovies.moviesByGenres.map((item, idx) => (
            <Fragment key={idx + '-' + topMovies.filters.year}>
              <MovieCarousel title={item.genre_name} movieList={item.results}/>
            </Fragment>
          ))
        }
      </div>
    </div>
  );
};

export default TopMovies;