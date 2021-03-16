import React, { useEffect } from 'react';
import MovieCardCarousel from '../shared/movie-card-carousel/MovieCardCarousel';
import style from './Home.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { top10MoviesSelector } from '../services/slices-selectors/movies';
import { fetchTop10Movies } from '../services/epics/movies';

const Home: React.FC = () => {
  const top10Movies = useSelector(top10MoviesSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTop10Movies());
  }, [dispatch]);

  return (
    <div className={style['home-component']}>
      <MovieCardCarousel movieList={top10Movies} title='Top 10 Best Popular Movies'/>
    </div>
  );
};

export default Home;