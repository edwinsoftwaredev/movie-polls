import React, { useEffect, useRef } from 'react';
import style from './MovieCard.module.scss';

const MovieCard: React.FC<any> = ({
  title,
  popularity,
  genres,
  width,
  backdrop
}) => {
  const cardReference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ref = cardReference.current;

    const handleTransitionEnd = (e: TransitionEvent) => {

      e.stopPropagation();
    };

    ref?.addEventListener('transitionend', handleTransitionEnd);

    return () => {
      ref?.removeEventListener('transitionend', handleTransitionEnd);
    }
  }, []);

  return (
    <div className={style['movie-card-container']} ref={cardReference}>
      <div
        style={{width: width + 'px', height: (width*9)/16 + 'px'}}
        className={style['movie-card-component']}
      >
        <div className={style['before']} style={{backgroundImage: `url(${backdrop})`}}></div>
        <div className={style['header']}>
          <div className={style['title']}>{title}</div>
          <div className={style['space']}></div>
          <div className={style['menu-btn']}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className={style['space']}></div>
        <div className={style['data']}>
          <div className={style['genres']}>
            <ul>
              {
                genres.map((genre: string, index: number) => (
                  <li key={index}>{genre}</li>
                  )
                )
              }
            </ul>
          </div>
          <div className={style['separator']}></div>
          <div className={style['popularity']}>
            🤩<span> {popularity}</span>
          </div>
        </div>
      </div>
    </div>
  )
};

export default MovieCard;