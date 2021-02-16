import React, { useEffect, useRef, useState } from 'react';
import style from './CardOverlay.module.scss';
import popularyIcon from '../../resources/icons/star-struck.png';
import { IMovie } from '../../interfaces/movie-types';

interface ICardOverlay {
  card: HTMLDivElement | undefined | null,
  clearCardOverlay: () => void,
  movie: IMovie,
  isMobile: boolean
}

const CardOverlay: React.FC<ICardOverlay> = (props: ICardOverlay) => {
  const [active, setActive] = useState(false);
  const [transitionEnded, setTransitionEnded] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = () => {
    setActive(false);
  };

  useEffect(() => {
    if (props.card) {
      setActive(true);
      setTransitionEnded(false);
    }
  }, [props.card]);

  useEffect(() => {
    const ref = overlayRef.current;

    const handleTransionEnd = () => {
      if (!active) {
        setTransitionEnded(true);
        props.clearCardOverlay();
      }
    };

    ref?.addEventListener('transitionend', handleTransionEnd);

    return () => {
      ref?.removeEventListener('transitionend', handleTransionEnd);
    };
  }, [active, props]);

  return (
    <div 
      className={
        style['card-overlay-component'] + ' ' +
        (active ? style['active'] : '')
      }
      style={{
        zIndex: (transitionEnded ? -100 : 100)
      }}
      onClick={handleOverlayClick}
      ref={overlayRef}
    >
      {
        props.card ? (
          <div
            className={
              style['card-overlay'] + ' ' +
              (active ? style['active'] : '')
            }
            style={{
              height: props.card?.getBoundingClientRect().height ?? 0,
              width: props.card?.getBoundingClientRect().width - 4 ?? 0, // - 4 => padding
              left: props.card?.getBoundingClientRect().left + 2 ?? 0, // + 2 => padding
              top: props.card?.getBoundingClientRect().top ?? 0
            }}
            onClick={e => e.stopPropagation()}
          >
            <div 
              className={style['before']}
              style={{
                backgroundImage: (
                  props.isMobile ? 
                    `url(${process.env.REACT_APP_TMDB_API_POSTER_URL}/${props.movie.poster_path})` : 
                    `url(${process.env.REACT_APP_TMDB_API_BACKDROP_URL}/${props.movie.backdrop_path})`
                )
              }}
            >
            </div>
            <div 
              className={
                style['content'] + ' ' +
                (active ? style['active'] : '')
              }
            >
              <div className={style['primary-info']}>
                <div className={style['title']}>
                  {props.movie.title} 
                </div>
                <div className={style['release-date']}>
                  ({props.movie.release_date.split('-')[0]})
                </div>
                <div className={style['popularity']}>
                  <img 
                    alt='Popularity' 
                    src={popularyIcon}
                  /> 
                  <span>{props.movie.vote_average*10}%</span>
                </div>
                <div className={style['overview']}>
                  {props.movie.overview}
                </div>
                <div className={style['genres']}>
                  <div>{props.movie.genre_names.join(', ')}</div>
                </div>
              </div>
            </div>
          </div>
        ) : null
      }
    </div>
  );
};

export default CardOverlay;