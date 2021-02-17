import React, { useEffect, useRef, useState } from 'react';
import style from './CardOverlay.module.scss';
import popularityIcon from '../../resources/icons/star-struck.png';
import { IMovie, IMovieDetail } from '../../interfaces/movie-types';
import Axios, { AxiosResponse } from 'axios';
import Button from "../../button/Button.test";
import TextInput from "../../inputs/text-input/TextInput";

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
  const [cast, setCast] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>('');
  const [director, setDirector] = useState<string>('');
  const [certification, setCertificaction] = useState<string>('');

  const handleOverlayClick = () => {
    setActive(false);
  };

  useEffect(() => {
    if (props.movie) {
      Axios.get(`${process.env.REACT_APP_TMDB_API_URL}/movie/${props.movie.id}`,
      {
        params: {
          api_key: process.env.REACT_APP_TMDB_API_KEY,
          append_to_response: 'credits,release_dates'
        }
      }).then((response: AxiosResponse<IMovieDetail>) => {
        const hours = Math.floor(response.data.runtime / 60);
        const mins = response.data.runtime % 60;
        setDuration(hours + 'h ' + mins + 'm')
        setCast(response.data.credits.cast.slice(0, 4).map(value => value.name))
        setDirector(response.data.credits.crew.filter(value => value.job === 'Director')[0].name);
        setCertificaction(
          response.data.release_dates.results
            .filter(value => value.iso_3166_1 === 'US')[0]
            .release_dates[0]
            .certification
        );
      });
    }
  }, [props.movie]);

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
                <div className={style['header']}>
                  <div className={style['title']}>
                    {props.movie.title}
                  </div>
                  <div className={style['release-date']}>
                   ({props.movie.release_date.split('-')[0]})
                  </div>
                  {
                    certification ? (
                      <div className={style['certification']}>
                        {certification}
                      </div>
                    ) : (<div></div>)
                  }
                  <div className={style['popularity']}>
                    <img 
                      alt='Popularity' 
                      src={popularityIcon}
                    /> 
                    <span>{props.movie.vote_average*10}%</span>
                  </div>
                </div>
                <div className={style['overview']}>
                  <div className={style['description']}>
                    {props.movie.overview}
                  </div>
                  <div className={style['movie-info']}>
                    <div className={style['director']}>
                      <span>Director: </span>{director}
                    </div>
                    <div className={style['cast']}>
                      <span>Cast: </span>{cast.join(', ')}
                    </div>
                    <div className={style['duration']}>
                      <span>Duration: </span>{duration}
                    </div>
                  </div>
                </div>
                <div className={style['genres']}>
                  <div>{props.movie.genre_names.join(', ')}</div>
                </div>
              </div>
              <div className={style['movie-poll-menu']}>
                <div className={style['menu']}>
                  <div className={style['title']}>
                    Add this movie to a poll
                  </div>
                  <div className={style['available-polls-container']}>
                    <div className={style['poll-options']}>
                      <div className={style['header']}>
                        Create a New Poll
                      </div>
                      <form
                        className={style['new-poll-form']}
                        onSubmit={e => e.preventDefault()}
                      >
                        <TextInput
                          name={'poll-name'}
                          placeholder={'Type the name of the poll'}
                          otherProperties={{
                            required: 'true',
                            autoComplete: 'off',
                            pattern: '[0-9A-Za-z]*'
                          }}
                        />
                        <Button
                          name={'Add To A New Poll'}
                          type={"submit"}
                          classType={"default"}
                        />
                      </form>
                    </div>
                    <div className={style['available-poll-details']}>
                      <div className={style['header']}>
                        Available Polls
                      </div>
                    </div>
                  </div>
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