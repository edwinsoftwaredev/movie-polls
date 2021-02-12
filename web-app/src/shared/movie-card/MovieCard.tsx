import React, { useEffect, useRef, useState } from 'react';
import style from './MovieCard.module.scss';
import {IMovie} from '../movie-card-carousel/slider/Slider';
import popularyIcon from '../resources/icons/star-struck.png';

interface IMovieCard {
  movie: IMovie,
  width: number,
  handleOverlay: (card: HTMLDivElement | undefined | null, movie: IMovie) => void
}

const MovieCard: React.FC<IMovieCard> = (props: IMovieCard) => {
  const cardReference = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const ref = cardReference.current;

    const handleTransitionEnd = (e: TransitionEvent) => {

      e.stopPropagation();
    };

    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }

    ref?.addEventListener('transitionend', handleTransitionEnd);
    window.addEventListener('resize', handleResize);

    if (window.innerWidth <= 768) {
      setIsMobile(true);
    } 

    return () => {
      ref?.removeEventListener('transitionend', handleTransitionEnd);
      window.removeEventListener('resize', handleResize);
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
        onClick={e => {
          props.handleOverlay(cardReference.current, props.movie);
          e.stopPropagation();
        }}
      >
        <div 
          className={style['before']} 
          style={{
            backgroundImage: (isMobile ? `url(${props.movie.poster})` : `url(${props.movie.backdrop})`) 
          }}
        ></div>
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
            <span>{props.movie.genres.join(', ')}</span>
          </div>
          <div className={style['separator']}></div>
          <div className={style['popularity']}>
            <img 
              alt='Populary'
              src={popularyIcon}
            />
            <span> {props.movie.popularity}</span>
          </div>
        </div>
      </div>
    </div>
  )
};

export default MovieCard;