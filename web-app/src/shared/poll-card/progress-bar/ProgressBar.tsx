import React from 'react';
import style from './ProgressBar.module.scss';

interface IProgressBar {
  progress: number | null;
}

const ProgressBar: React.FC<IProgressBar> = (props: IProgressBar) => {
  return (
    <div title={'Poll Progress'} className={style['progress-bar-component']}>
      <div className={style['progress-bar-container']}>
        <div className={style['progress-bar']} style={{width: props.progress + '%'}}></div>
      </div>
      {
        props.progress ? (
          <div className={style['percentage-label']}>{props.progress}%</div>
        ) : null
      }
    </div>
  )
};

export default ProgressBar;