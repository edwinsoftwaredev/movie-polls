import React, { Fragment, useEffect } from 'react';
import MovieCardCarousel from '../shared/movie-card-carousel/MovieCardCarousel';
import style from './Home.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { nowPlayingSelector, top10PopularSelector, top10TrendingSelector } from '../services/slices-selectors/movies';
import { fetchTop10Popular } from '../services/epics/popular-movies';
import { fetchTop10Trending } from '../services/epics/trending-movies';
import { fetchNowPlaying } from '../services/epics/now-playing-movies';
import PollCardContainer from '../shared/poll-card-container/PollCardContainer';

const Home: React.FC = () => {
  const top10Popular = useSelector(top10PopularSelector);
  const top10Trending = useSelector(top10TrendingSelector);
  const nowPlaying = useSelector(nowPlayingSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTop10Popular());
    dispatch(fetchTop10Trending());
    dispatch(fetchNowPlaying());
  }, [dispatch]);

  return (
    <Fragment>
      <div id='sliders-container' className={style['sliders-container']}>
        <PollCardContainer status={'current'}/>
        <MovieCardCarousel movieList={top10Popular} title='Top 10 Best Popular Movies'/>
        <MovieCardCarousel movieList={top10Trending} title='Top 10 Best Trending Movies'/>
        <MovieCardCarousel movieList={nowPlaying} title='Now Playing' />
      </div>
    </Fragment>
  );
};

export default Home;