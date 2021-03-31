import React, { Fragment, useEffect, useRef, useState } from 'react';
import style from './MovieCard.module.scss';
import popularyIcon from '../resources/icons/star-struck.png';
import { IMovie } from '../interfaces/movie-types';
import { useSelector } from 'react-redux';
import { sliderPropertiesSelector } from '../../services/slices-selectors/slider-properties';

interface IMovieCard {
  movie: IMovie,
  handleOverlay: (card: HTMLDivElement | undefined | null, movie: IMovie) => void
}

const MovieCard: React.FC<IMovieCard> = (props: IMovieCard) => {
  const cardReference = useRef<HTMLDivElement>(null);
  const [isMovie, setIsMovie] = useState(false);
  const sliderProperties = useSelector(sliderPropertiesSelector);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const movie = props.movie;
    if (movie.title && movie.genre_names && movie.vote_average) {
      setIsMovie(true);
    }
  }, [props.movie]);

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
        style={{width: sliderProperties.cardWidth + 'px', height: (sliderProperties.cardWidth*9)/16 + 'px'}}
        className={style['movie-card-component']}
        onClick={e => {
          if (isMovie) {
            props.handleOverlay(cardReference.current, props.movie);
            e.stopPropagation();
          }
        }}
      >
        {
          isMovie ? (
            <Fragment>
              <div
                className={style['before']}
              >
              <img 
                className={loaded ? style['loaded'] : ''}
                alt={props.movie.title}
                src={
                  sliderProperties.isMobile ?
                  `${process.env.REACT_APP_TMDB_API_POSTER_URL}/${props.movie.poster_path}` : 
                  `${process.env.REACT_APP_TMDB_API_BACKDROP_URL}/${props.movie.backdrop_path}`                   
                }
                onLoad={e => setLoaded(true)}
              />
              </div>
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
                  <div>{props.movie.genre_names?.join(', ') ?? ''}</div>
                </div>
                <div className={style['popularity']}>
                  <img 
                    alt='Populary'
                    src={popularyIcon}
                  />
                  <span> {props.movie.vote_average*10}%</span>
                </div>
              </div>
            </Fragment>
          ) : null
        }
      </div>
    </div>
  )
};

export default MovieCard;