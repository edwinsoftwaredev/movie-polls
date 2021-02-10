import React, { useEffect, useRef, useState } from 'react';
import { Transition } from 'react-transition-group';
import { IMovie } from '../slider/Slider';
import style from './CardOverlay.module.scss';

interface ICardOverlay {
  card: HTMLDivElement | undefined | null,
  clearCardOverlay: () => void,
  movie: IMovie
}

const CardOverlay: React.FC<ICardOverlay> = (props: ICardOverlay) => {
  const [active, setActive] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = () => {
    setActive(false);
  };  

  useEffect(() => {
    if (props.card) {
      setActive(true);
    }
  }, [props.card]);

  useEffect(() => {
    const ref = overlayRef.current;

    const handleTransionEnd = () => {
      if (!active) {
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
                backgroundImage: `url(${props.movie.backdrop})`
              }}
            >
            </div>
            <div 
              className={
                style['content'] + ' ' +
                (active ? style['active'] : '')
              }
              style={{
                transition: (active ? '350ms ease-out' : '0ms'),
                transitionDelay: (active ? '400ms' : '0')
              }}
            >
              <div className={style['primary-info']}>
                <div className={style['title']}>
                  {props.movie.title}
                </div>
                <div className={style['popularity']}>
                  🤩 <span>{props.movie.popularity}</span>
                </div>
                <div className={style['genres']}>
                  <ul>
                    {
                      props.movie.genres.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))
                    }
                  </ul>
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