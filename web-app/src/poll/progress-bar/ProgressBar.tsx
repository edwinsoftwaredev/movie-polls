import React from 'react';
import style from './ProgressBar.module.scss';

const ProgressBar: React.FC<{
  progress: number, 
  title: string, 
  type: 'normal' | 'movie-poll-result',
  votes?: number}> = ({progress, title, type, votes}) => {
  return (
    <div className={style['progress-bar-component'] + ' ' + style[type]}>
      {!title ? null :  (<div className={style['title']}>{title}</div>)}
      <div className={style['container']}>        
        <div className={style['progress-bar-container']}>
          <div style={{width: progress + '%'}} className={style['progress-bar']}></div>
        </div>
        <div className={style['label']}>{progress}%{votes !== undefined ? ` (${votes})` : ''}</div>
      </div>
    </div>
  );
};

export default ProgressBar;