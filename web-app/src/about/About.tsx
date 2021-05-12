import React from 'react';
import style from './About.module.scss';

const About: React.FC = () => {
  return (
    <div className={style['sliders-container']}>
      <div className={style['about-component']}>
        <div className={style['app-title']}>
          Movie Polls
        </div>
        <div className={style['content']}>
          Movie Polls helps you decide which movie 
          is the best movie to watch when you have many options.
          Just make a poll and let other people help you.
        </div>
        <div className={style['powered-by-title']}>
          <div className={style['app-title']}>
            Movie Polls
          </div>
          is powered by:
        </div>
        <div className={style['tmdb-api']}>
          <img
            title={'The Movie Database API'}
            alt='The Movie Database API' 
            src={`https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg`}
          />
        </div>
        <div className={style['justwatch-provider-api']}>
          <img
            title={'JustWatch'}
            alt={'JustWatch'}
            src={'https://www.justwatch.com/appassets/img/JustWatch-logo-large.png'}
          />
        </div>
      </div>
    </div>
  );
};

export default About;