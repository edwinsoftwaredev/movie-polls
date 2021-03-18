import React, { useEffect } from 'react';
import MovieCardCarousel from '../shared/movie-card-carousel/MovieCardCarousel';
import style from './Home.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { top10PopularSelector, top10TrendingSelector } from '../services/slices-selectors/movies';
import { fetchTop10Popular } from '../services/epics/popular-movies';
import { fetchTop10Trending } from '../services/epics/trending-movies';

const Home: React.FC = () => {
  const top10Popular = useSelector(top10PopularSelector);
  const top10Trending = useSelector(top10TrendingSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTop10Popular());
    dispatch(fetchTop10Trending());
  }, [dispatch]);

  return (
    <div className={style['home-component']}>
      <MovieCardCarousel movieList={top10Popular} title='Top 10 Best Popular Movies'/>
      <MovieCardCarousel movieList={top10Trending} title='Top 10 Best Trending Movies'/>
    </div>
  );
};

export default Home;