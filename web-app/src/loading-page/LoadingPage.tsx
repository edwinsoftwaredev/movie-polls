import React from 'react';
import style from './LoadingPage.module.scss';

const LoadingPage = () => {
  return (
    <div className={style['loading-page-component']}>
      <div className={style['content']}>
        Loading page works!
      </div>
    </div>
  )
};

export default LoadingPage;