import React from 'react';
import style from './LoadingPage.module.scss';

const LoadingPage = () => {
  return (
    <div className={style['loading-page-component']}>
      <div className={style['container']}>
        <div className={style['app-title']}>
          Movie Polls
        </div>
      </div>
    </div>
  )
};

export default LoadingPage;