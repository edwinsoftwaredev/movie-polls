import React from 'react';
import MovieCardCarousel from '../shared/movie-card-carousel/MovieCardCarousel';
import style from './Home.module.scss';

const Home: React.FC = () => {
  return (
    <div className={style['home-component']}>
      <MovieCardCarousel title='Top 10 Movies'/>
    </div>
  );
};

export default Home;