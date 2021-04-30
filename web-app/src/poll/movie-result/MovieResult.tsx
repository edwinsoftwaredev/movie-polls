import React from 'react';
import ProgressBar from '../progress-bar/ProgressBar';
import style from './MovieResult.module.scss';

const MovieResult: React.FC<{progress: number, votes: number}> = ({progress, votes}) => {
  return (
    <div className={style['result-component']}>
      <ProgressBar 
        progress={progress} 
        title={progress > 50 ? 'WINNER' : ''}
        type={'movie-poll-result'} 
        votes={votes}
      />
    </div>
  );
};

export default MovieResult;