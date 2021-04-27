import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import MovieService from '../services/movie-service';
import { pollsSelector } from '../services/slices-selectors/polls';
import { IPoll } from '../shared/interfaces/movie-poll-types';
import { IMovie } from '../shared/interfaces/movie-types';
import style from './Poll.module.scss';
import {ReactComponent as EditVector} from '../shared/resources/vectors/edit-3.svg';
import {ReactComponent as SaveVector} from '../shared/resources/vectors/save.svg';
import Spinner from '../shared/spinners/Spinners';
import { deleteMovie, patchPoll } from '../services/epics/polls';

enum VOTE_STATUS {
  NOT_FETCHED,
  VOTED,
  NOT_VOTED,
  VOTING
}

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

const PollNameInput: React.FC<{
  onChange: (value: string) => void, 
  init: string,
  updatable: boolean
}> = ({onChange, init, updatable}) => {
  const [editable, setEditable] = useState(false);
  const [initVal, setInitVal] = useState(init);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!editable && initVal !== init && !isSaving) {
      setIsSaving(true);
      onChange(initVal);
    }
  }, [initVal, onChange, editable, init, isSaving]);

  useEffect(() => {
    if (initVal === init && isSaving) {
      setIsSaving(false);
    }
  }, [isSaving, initVal, init]);
  
  return (
    <div className={style['text-input-component']}>
      <form onSubmit={e => {setEditable(false); e.preventDefault();} }>
        <input 
          type='text' 
          onChange={e => setInitVal(e.target.value)} 
          value={initVal}
          disabled={!editable && updatable}
        />
        {
          updatable ? (
            <button 
              type='button' 
              title={editable ? 'Save' : 'Edit Title'}
              className={style['edit-vector']} 
              onClick={e => setEditable(state => !state)}>
              {
                editable ? <SaveVector /> : isSaving ? <Spinner color={'white'}/> : <EditVector /> 
              } 
            </button>
          ) : null
        }
      </form>
    </div>
  )
}

const Header: React.FC<{poll: IPoll}> = ({poll}) => {
  const [isDateUpdated, setIsDateUpdated] = useState(true);
  const [isInvalidDate, setIsInvalidDate] = useState(false);
  const dispatch = useDispatch();

  const now = new Date(new Date().setMinutes(new Date().getMinutes() + 30));

  const handleNameChange = (pollName: string) => {
    if (poll.id && pollName)
      dispatch(patchPoll({id: poll.id, pollPatch: {name: pollName}}));
  };

  const handleEndDateChange = (endDate: string) => {
    if (new Date(Date.now()) >= new Date(endDate)) {
      setIsInvalidDate(true);
    } else {
      setIsInvalidDate(false);
    }
      

    if (poll.id && new Date(Date.now()) <= new Date(endDate)) {
      setIsDateUpdated(false);
      dispatch(patchPoll({id: poll.id, pollPatch: {endsAt: new Date(endDate)}}));
    }
  }

  const getInitEndDate = (endDate: string) => {
    const date = new Date(endDate);
    const year = date.getFullYear();
    const month = date.getMonth() < 10 ? '0' + (date.getMonth() + 1)  : (date.getMonth() + 1);
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

    return `${year}-${month}-${day}T${date.toTimeString().split(':', 2).join(':')}`;
  };

  useEffect(() => {
    setIsDateUpdated(true);
  }, [poll]);

  return (
    <Fragment>
      <div className={
        style['header'] + ' ' +
        (poll.isOpen ? style['open-poll-header'] : '') 
      }>
        {
          poll.isOpen ? (
            <button className={style['release-poll-btn']}>START POLL</button>
          ) : null
        }
        <PollNameInput 
          init={poll.name} 
          onChange={handleNameChange}
          updatable={true && !!poll.isOpen} // this should be based on the ownership of the poll
        />
        <div className={style['space']}></div>
        {
          poll.isOpen ? null : (
            <ProgressBar 
              progress={Math.trunc(Math.random()*100)} 
              title={'Poll Progress'} 
              type={'normal'}
            />
          )
        }
        {
          poll.isOpen ? (
          <div className={style['end-date-picker']}>
            <div>Ends At: </div>
            <input 
              className={isInvalidDate ? style['invalid-date'] : ''}
              type='datetime-local' 
              value={poll.endsAt ? getInitEndDate(poll.endsAt?.toString()) : ''} 
              min={`${now.getFullYear()}-${now.getMonth() < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1}-${now.getDate()}T${now.getHours()}:${now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()}`}
              max={new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split(':', 2).join(':')} 
              onChange={e => handleEndDateChange(e.target.value)}
              disabled={!isDateUpdated}
            />
          </div>) : 
          (
            <div className={style['end-date']}>
              <div>Ends At: </div>
              <div>
                {new Date().toDateString() + ' ' + new Date().toLocaleTimeString([], {timeStyle: 'short'})}
              </div>
            </div>
          )
        }
      </div>
    </Fragment>
  )
};

const Movie: React.FC<{
  movie: IMovie,
  progress: number,
  votes: number,
  isOpenPoll: boolean,
  pollId: number,
  voted: VOTE_STATUS,
  onVote: () => void}> = ({movie, progress, votes, isOpenPoll, pollId, voted, onVote}) => {
  const [loadedPoster, setLoadedPoster] = useState(false);
  const [cast, setCast] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>('');
  const [director, setDirector] = useState<string>('');
  const [certification, setCertificaction] = useState<string>('');
  const [providers, setProviders] = useState<any>();
  const [showSpinner, setShowSpinner] = useState(false);
  const [movieVoted, setMovieVoted] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = () => {
    setShowSpinner(true);
    dispatch(deleteMovie({movieId: movie.id, pollId: pollId}));
  }

  const handleVote = () => {
    onVote();
    setMovieVoted(true);
    // dispatch(somethig);
  }

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
          {
            isOpenPoll ? (
              <button className={style['delete-movie-btn']} onClick={handleDelete}>
                  {!showSpinner ? 'Remove' : <Spinner color={'red'} />}
              </button>
            ) : voted === VOTE_STATUS.NOT_FETCHED ? null : voted === VOTE_STATUS.VOTED ? (
              <div className={style['movie-poll-result']}>
                <div className={style['movie-poll-result-title']}>
                  Poll result for this movie: 
                </div>
                <MovieResult 
                  progress={Math.trunc(Math.random()*100)}
                  votes={Math.trunc(Math.random()*100)} 
                /> {/* change mock value by progress parameter */}
              </div>   
            ) : (
              <button 
                className={
                  style['vote-movie-button'] + ' ' +
                  (voted === VOTE_STATUS.VOTING && !movieVoted ? style['disabled'] : '') 
                } 
                onClick={handleVote}
                disabled={voted === VOTE_STATUS.VOTING}
              >
                {
                  voted === VOTE_STATUS.VOTING && movieVoted ? (
                    <Spinner color={'white'}/>
                  ) : 'VOTE FOR THIS MOVIE'
                }
              </button>
            )
          }
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
  const [voted, setVoted] = useState<VOTE_STATUS>(VOTE_STATUS.NOT_FETCHED); // change to NOT_FETCHED
  // const history = useHistory();
  
  // when this component loads it does with a token
  // if the token is used then the poll must be considered 
  // as voted by the user.

  useEffect(() => {
    if (polls && location.search) {
      setId(getId(location.search));
    }
  }, [location, polls]);

  useEffect(() => {
    setPoll(polls && polls.filter(poll => poll.id === id)[0]);
    // This could leads to memory leaks. Test before implementation.
    // history.push('/my-polls'); // this should be called for the poll author
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
        !poll || !poll.id ? null : (
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
                    isOpenPoll={!!poll.isOpen}
                    pollId={poll.id as number}
                    voted={voted}
                    onVote={() => setVoted(VOTE_STATUS.VOTING)}
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