import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import MovieService from '../services/movie-service';
import { pollsSelector } from '../services/slices-selectors/polls';
import { IPoll } from '../shared/interfaces/movie-poll-types';
import { IMovie } from '../shared/interfaces/movie-types';
import style from './Poll.module.scss';

const getId = (search: string): number | null => {
  const value = Number.parseInt(new URLSearchParams(search).get('id') ?? ''); 
  return Number.isNaN(value) ? null : value;
}

const Header: React.FC<{poll: IPoll}> = ({poll}) => {
  return (
    <Fragment>
      <div className={style['header']}>
        <div className={style['title']}>
          {poll.name}
        </div>
        <div 
          className={
            style['status'] + ' ' + 
            (!poll.isOpen ? style['released'] : style['not-released'])
          }>
          {!poll.isOpen ? 'Released' : 'Not Released'}
        </div>
        <div className={style['space']}></div>
        <div className={style['end-date']}>
          <div>Ends At: </div>
          <div>
            {new Date().toDateString() + ' ' + new Date().toLocaleTimeString([], {timeStyle: 'short'})}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

const Movie: React.FC<{movie: IMovie}> = ({movie}) => {
  const [loadedPoster, setLoadedPoster] = useState(false);
  const [cast, setCast] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>('');
  const [director, setDirector] = useState<string>('');
  const [certification, setCertificaction] = useState<string>('');

  useEffect(() => {
    const getDetails = async (id: number) => {
      const details = await MovieService.getMovieDetails(id);
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

    getDetails(movie.id);
  }, [movie]);

  return (
    <div className={style['movie']}>
      <div className={style['poster-container']}>
        <img
          className={
            style['poster'] + ' ' +
            (loadedPoster ? style['loaded'] : '')
          }
          onLoad={e => setLoadedPoster(true)}
          title={movie.title}
          alt={movie.title}
          src={`${process.env.REACT_APP_TMDB_API_BACKDROP_URL}/${movie.backdrop_path}`} 
        />
      </div>
      <div className={style['movie-data']}>
        <div className={style['main-data']}>
          <div className={style['header']}>
            <div className={style['title']}>{movie.title}</div>
            <div className={style['release-date']}>
              ({movie.release_date.split('-')[0]})
            </div>
            {
              !certification ? null : (
                <div className={style['certification']}>
                  {certification}
                </div>
              ) 
            }
          </div>
          <div className={style['description-cast']}>
            <div className={style['description']}>
              {movie.overview}
            </div>
            <div className={style['cast-data']}>
              <div><span>Director: </span>{director}</div>
              <div><span>Cast: </span>{cast.join(', ')}</div>
            </div>
          </div>
          <div className={style['genres']}>{movie.genre_names.join(', ')}</div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

const Poll: React.FC = () => {
  const [id, setId] = useState<number | null>(null);
  const [poll, setPoll] = useState<IPoll | null>(null);
  const polls = useSelector(pollsSelector);
  const location = useLocation(); 

  useEffect(() => {
    if (polls && location.search) {
      setId(getId(location.search));
    }
  }, [location, polls]);

  useEffect(() => {
    setPoll(state => polls?.filter(poll => poll.id === id)[0] ?? state);
  }, [id, polls]);

  return (
    <div
      id='sliders-container' 
      className={
        style['poll-component'] + ' ' +
        style['sliders-container']
      }
    >
      {
        !poll ? null : (
          <div className={style['poll-container']}>
            <Header poll={poll}/>
            <div className={style['movies-container']}>
            {
              poll.movies.filter(movie => movie.movie).map(movie => (
                <Fragment key={movie.movieId}>
                  <Movie movie={movie.movie as IMovie}/>
                </Fragment>
              ))
            }
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Poll;