import React, { Fragment, useEffect, useRef, useState } from 'react';
import style from './CardOverlay.module.scss';
import popularityIcon from '../../resources/icons/star-struck.png';
import { IMovie } from '../../interfaces/movie-types';
import Button from "../../button/Button.test";
import TextInput from "../../inputs/text-input/TextInput";
import AvailablePollList from './available-polls-list/AvailablePollList';
import MovieService from '../../../services/movie-service';

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
  const [windowScrollY, setWindowScrollY] = useState<number>(0);
  const mountedRef = useRef<boolean>(false);

  const handleOverlayClick = () => {
    setActive(false);
  };

  useEffect(() => {
    mountedRef.current = true;
    if (props.movie) {

      const getDetails = async () => {
        const details = await MovieService.getMovieDetails(props.movie.id);
        if (details && mountedRef.current) {
          const hours = Math.floor(details.runtime / 60);
          const mins = details.runtime % 60;

          setDuration(hours + 'h ' + mins + 'm');
          setCast(details.credits.cast.slice(0, 4).map(value => value.name));
          setDirector(details.credits.crew.filter(value => value.job === 'Director')[0]?.name ?? '');
          setCertificaction(
            details.release_dates.results
              .filter(value => value.iso_3166_1 === 'US')[0]
              ?.release_dates[0]
              .certification
          );
        }
      };

      getDetails();
    }

    return () => {
      mountedRef.current = false;
    }
  }, [props.movie]);

  useEffect(() => {
    if (props.card) {
      setActive(true);
      setTransitionEnded(false);
    }
  }, [props.card]);

  useEffect(() => {
    if (active) {
      if (window.innerHeight < document.body.clientHeight) {
        document.body.style.overflowY = 'scroll';
        if (overlayRef.current) {
          overlayRef.current.style.minHeight = `${window.innerHeight}px`;
        }
      }

      const el = document.getElementById('home-component');
      if (el) {
        setWindowScrollY(window.scrollY);
        el.style.top = `-${window.scrollY}px`;
        el.style.position = 'fixed';
        el.style.width = '100%';
        el.style.height = '100%';
      }
    }
  }, [active]);

  useEffect(() => {
    const ref = overlayRef.current;

    const handleTransionEnd = () => {
      if (!active) {
        const el = document.getElementById('home-component');

        if (window.innerHeight < document.body.clientHeight) {
          document.body.style.overflowY = 'auto';
        }

        if (el) {
          el.style.top = 'unset';
          el.style.position = 'static';
          window.scroll({top: windowScrollY});
        }

        setTransitionEnded(true);
        setCast([]);
        setDuration('');
        setDirector('');
        setCertificaction('');
        props.clearCardOverlay();
      }
    };

    ref?.addEventListener('animationend', handleTransionEnd);

    return () => {
      ref?.removeEventListener('animationend', handleTransionEnd);
    };
  }, [active, props, windowScrollY]);

  return (
    <Fragment>
      <div className={
          style['overlay-background'] + ' ' + (active ? style['active'] : '')
        }
        onClick={handleOverlayClick}
      >
      </div>
      <div 
        className={
          style['card-overlay-component'] + ' ' +
          (active ? style['active'] : '')
        }
        style={{
          zIndex: (transitionEnded ? -100 : 100)
        }}
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
                  // height: props.card?.getBoundingClientRect().height ?? 0,
                  width: props.card?.getBoundingClientRect().width - 4 ?? 0, // - 4 => padding
                  left: props.card?.getBoundingClientRect().left + 2 ?? 0, // + 2 => padding
                  top: props.card?.getBoundingClientRect().top ?? 0
              }}
              onClick={e => e.stopPropagation()}
            >
              <div className={style['grid-container']}>
                <div 
                  className={style['before']}
                  style={{
                    backgroundImage: (
                      props.isMobile ? 
                        `url(${process.env.REACT_APP_TMDB_API_POSTER_URL}/${props.movie.poster_path})` : 
                        `url(${process.env.REACT_APP_TMDB_API_BACKDROP_URL}/${props.movie.backdrop_path})`
                    ),
                    height: props.card?.getBoundingClientRect().height ?? 0
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
                          {director ? (<Fragment><span>Director: </span>{director}</Fragment>) : null}
                        </div>
                        <div className={style['cast']}>
                          {cast.length ? (<Fragment><span>Cast: </span>{cast.join(', ')}</Fragment>) : null}
                        </div>
                        <div className={style['duration']}>
                          {duration ? (<Fragment><span>Duration: </span>{duration}</Fragment>) : null}
                        </div>
                      </div>
                    </div>
                    <div className={style['genres']}>
                      <div>{props.movie.genre_names.join(', ')}</div>
                    </div>
                  </div>
                </div>
                <div className={
                  style['movie-poll-menu'] + ' ' +
                  (active ? style['active'] : '')
                }>
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
                            placeholder={'Type the name of the new poll'}
                            otherProperties={{
                              required: true,
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
                      <hr/>
                      <div className={style['available-poll-details']}>
                        <div className={style['header']}>
                          Available Polls
                        </div>
                        <div className={style['poll-list']}>
                          <AvailablePollList />
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
    </Fragment>
  );
};

export default CardOverlay;