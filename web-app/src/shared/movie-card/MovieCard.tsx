import React, { useEffect, useRef } from 'react';
import style from './MovieCard.module.scss';
import {IMovie} from '../movie-card-carousel/slider/Slider';

interface IMovieCard {
  movie: IMovie,
  width: number,
  handleOverlay: (card: HTMLDivElement | undefined | null, movie: IMovie) => void
}

const MovieCard: React.FC<IMovieCard> = (props: IMovieCard) => {
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
    <div 
      className={style['movie-card-container']} 
      ref={cardReference}
    >
      <div
        style={{width: props.width + 'px', height: (props.width*9)/16 + 'px'}}
        className={style['movie-card-component']}
      >
        <div className={style['before']} style={{backgroundImage: `url(${props.movie.backdrop})`}}></div>
        <div className={style['header']}>
          <div className={style['title']}>{props.movie.title}</div>
          <div className={style['space']}></div>
          <div className={style['menu-btn']} onClick={e => {
              props.handleOverlay(cardReference.current, props.movie)
              e.stopPropagation(); 
            }}
          >
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
                props.movie.genres.map((genre: string, index: number) => (
                  <li key={index}>{genre}</li>
                  )
                )
              }
            </ul>
          </div>
          <div className={style['separator']}></div>
          <div className={style['popularity']}>
            🤩<span> {props.movie.popularity}</span>
          </div>
        </div>
      </div>
    </div>
  )
};

export default MovieCard;