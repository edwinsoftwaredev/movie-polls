import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrending } from '../services/epics/trending-movies';
import { trendingSelector } from '../services/slices-selectors/trending-movies';
import MovieCarousel from '../shared/movie-card-carousel/MovieCardCarousel';
import style from './TrendingMovies.module.scss';

const TrendingMovies: React.FC = () => {
  const dispatch = useDispatch();
  const trending = useSelector(trendingSelector);

  useEffect(() => {
    dispatch(fetchTrending());
  }, [dispatch]);

  return (
    <Fragment>
      <div id='sliders-container' className={style['sliders-container']}>
        {
          trending.map((item, idx) => (
            <Fragment key={idx}>
              <MovieCarousel title={item.genre_name} movieList={item.results}/>
            </Fragment>
          ))
        }
      </div>
    </Fragment>
  );
};

export default TrendingMovies;