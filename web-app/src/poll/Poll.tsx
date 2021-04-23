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

const ProgressBar: React.FC<{
  progress: number, 
  title: string, 
  type: 'normal' | 'movie-poll-result',
  votes?: number}> = ({progress, title, type, votes}) => {
  return (
    <div className={style['progress-bar-component'] + ' ' + style[type]}>
      {!title ? null :  (<div className={style['title']}>{title}</div>)}
      <div className={style['container']}>        
        <div className={style['progress-bar-container']}>
          <div style={{width: progress + '%'}} className={style['progress-bar']}></div>
        </div>
        <div className={style['label']}>{progress}%{votes !== undefined ? ` (${votes})` : ''}</div>
      </div>
    </div>
  );
};

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
        <ProgressBar 
          progress={Math.trunc(Math.random()*100)} 
          title={'Poll Progress'} 
          type={'normal'}
        />
        <div className={style['end-date']}>
          <div>Ends At: </div>
          <div>
            {new Date().toDateString() + ' ' + new Date().toLocaleTimeString([], {timeStyle: 'short'})}
          </div>
        </div>
      </div>
    </Fragment>
  )
};

const Movie: React.FC<{movie: IMovie, progress: number, votes: number}> = ({movie, progress, votes}) => {
  const [loadedPoster, setLoadedPoster] = useState(false);
  const [cast, setCast] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>('');
  const [director, setDirector] = useState<string>('');
  const [certification, setCertificaction] = useState<string>('');
  const [providers, setProviders] = useState<any>();

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
      )
    };

    const getProviders = async (id: number) => {
      const result = await MovieService.getMovieProviders(id);
      setProviders(result);
    };

    getDetails(movie.id);
    getProviders(movie.id);
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
            <div className={
              style['title']
            }>{movie.title}</div>
          </div>
          <div className={style['sub-header']}>
            <div className={
              style['release-date']
            }>
              ({movie.release_date.split('-')[0]})
            </div>
            {
              !certification ? null : (
                <div className={
                  style['certification']
                }>
                  {certification}
                </div>
              ) 
            }
          </div>
          <div className={style['description-cast']}>
            <div className={
              style['description']
            }>
              {movie.overview}
            </div>
            <div className={
              style['cast-data']
            }>
              <div><span>Director: </span>{director}</div>
              <div><span>Cast: </span>{cast.join(', ')}</div>
              <div><span>Duration: </span>{duration}</div>
            </div>
          </div>
          <div className={
            style['genres']
          }>{movie.genre_names.join(', ')}</div>
        </div>
        <div className={style['poll-data']}>
          <div className={style['providers']}>
            {
              providers && providers['US'].flatrate && <div className={style['providers-title']}>STREAMING ON</div>
            }
            <div className={style['providers-container']}>
              {
                providers && providers['US'].flatrate && providers['US'].flatrate.map((provider: any) => (
                  <div key={provider.provider_id} className={style['image-provider-container']}>
                    <img
                      className={style['provider-img']}
                      alt={provider.provider_name}
                      title={provider.provider_name}
                      src={`${process.env.REACT_APP_TMDB_API_PROVIDER_IMAGE}/${provider.logo_path}`}
                    />
                  </div>
                ))
              }
            </div>
            {providers && providers['US'].rent && <div className={style['providers-title']}>AVAILABLE ON</div>}
            <div className={style['providers-container']}>
              {
                providers && 
                providers['US'].rent &&
                providers['US'].rent.map((provider: any) => (
                  <div key={provider.provider_id} className={style['image-provider-container']}>
                    <img
                      className={style['provider-img']}
                      alt={provider.provider_name}
                      title={provider.provider_name}
                      src={`${process.env.REACT_APP_TMDB_API_PROVIDER_IMAGE}/${provider.logo_path}`}
                    />
                  </div>
                )) 
              }
            </div>
          </div>
          <div className={style['movie-poll-result']}>
            <div className={style['movie-poll-result-title']}>
              Poll result for this movie: 
            </div>
            <MovieResult 
              progress={Math.trunc(Math.random()*100)}
              votes={Math.trunc(Math.random()*100)} 
            /> {/* change mock value by progress parameter */}
          </div>
        </div>
      </div>
    </div>
  );
};

const MovieResult: React.FC<{progress: number, votes: number}> = ({progress, votes}) => {
  return (
    <div className={style['result-component']}>
      <ProgressBar 
        progress={progress} 
        title={progress > 50 ? 'WINNER' : ''}
        type={'movie-poll-result'} 
        votes={votes}
      />
    </div>
  );
};

const Poll: React.FC = () => {
  const [id, setId] = useState<number | null>(null);
  const [poll, setPoll] = useState<IPoll | null>(null);
  const polls = useSelector(pollsSelector);
  const location = useLocation(); 
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    if (polls && location.search) {
      setId(getId(location.search));
    }
  }, [location, polls]);

  useEffect(() => {
    setPoll(state => polls?.filter(poll => poll.id === id)[0] ?? state);
  }, [id, polls]);

  useEffect(() => {
    setTotalVotes(state => poll?.movies
      .filter(movie => movie.movie)
      .map(movie => movie.voteCount)
      .reduce((prev, curr) => prev && curr && prev + curr) ?? 0
    );
  }, [poll]);

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
                  <Movie 
                    movie={movie.movie as IMovie} 
                    progress={totalVotes === 0 ? 0 : Math.ceil(movie.voteCount ?? 0 / totalVotes)}
                    votes={movie.voteCount ?? 0}
                  />
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