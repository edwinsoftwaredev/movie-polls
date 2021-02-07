import React from 'react';
import style from './MovieCard.module.scss';

const MovieCard: React.FC<any> = ({
  title,
  popularity,
  genres,
  width
}) => {
  return (
    <div style={{width: width}} className={style['movie-card-component']}>
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
  )
};

export default MovieCard;