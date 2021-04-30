import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import MovieService from '../services/movie-service';
import { pollsSelector } from '../services/slices-selectors/polls';
import { IPoll, IToken } from '../shared/interfaces/movie-poll-types';
import { IMovie } from '../shared/interfaces/movie-types';
import style from './Poll.module.scss';
import {ReactComponent as EditVector} from '../shared/resources/vectors/edit-3.svg';
import {ReactComponent as SaveVector} from '../shared/resources/vectors/save.svg';
import Spinner from '../shared/spinners/Spinners';
import { deleteMovie, patchPoll } from '../services/epics/polls';
import PollService from '../services/poll-service';
import { userAuthenticationStatusSelector } from '../auth/auth-selectors';
import { USER_AUTHENTICATION_STATUS } from '../shared/utils/enums';
import { getUser } from '../firebase-config';
import {ReactComponent as DeleteVector} from '../shared/resources/vectors/delete.svg';
import {ReactComponent as LinkVector} from '../shared/resources/vectors/link.svg';
import {ReactComponent as CopyVector} from '../shared/resources/vectors/copy.svg';
import {ReactComponent as ChevronVector} from '../shared/resources/vectors/chevron-down.svg';
import { addToken } from '../services/epics/token';


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
          disabled={!editable || !updatable}
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

const Header: React.FC<{
  poll: IPoll, 
  changeStatusClbk: () => void,
  isUpdating: boolean,
  userIsAuthor: boolean
}> = ({poll, changeStatusClbk, isUpdating, userIsAuthor}) => {
  const [isDateUpdated, setIsDateUpdated] = useState(true);
  const [isInvalidDate, setIsInvalidDate] = useState(false);
  const [endDate, setEndDate] = useState(poll.endsAt && new Date(poll.endsAt));
  const [disabledButton, setDisabledButton] = useState(false);
  const dispatch = useDispatch();

  const now = new Date(new Date().setMinutes(new Date().getMinutes() + 30));

  const handleNameChange = (pollName: string) => {
    if (poll.id && pollName)
      dispatch(patchPoll({id: poll.id, pollPatch: {name: pollName}}));
  };

  const handleEndDateChange = (endDate: string) => {
    setEndDate(new Date(endDate));
    if (new Date() >= new Date(endDate)) {
      setIsInvalidDate(true);
    } else {
      setIsInvalidDate(false);
      
      if (poll.id && endDate && new Date() <= new Date(endDate)) {
        setIsDateUpdated(false);
        dispatch(patchPoll({id: poll.id, pollPatch: {endsAt: new Date(endDate)}}));
      }
    }
  }

  const getInitEndDate = (endDate: string) => {
    const date = new Date(endDate);
    const year = date.getFullYear();
    const month = date.getMonth() < 10 ? '0' + (date.getMonth() + 1)  : (date.getMonth() + 1);
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

    return `${year}-${month}-${day}T${date.toTimeString().split(':', 2).join(':')}`;
  };

  const handleStartPollClick = () => {
    poll.isOpen && setDisabledButton(!!(poll.endsAt && new Date(poll.endsAt) <= new Date()));
    changeStatusClbk();
  };

  useEffect(() => {
    setIsDateUpdated(true);
    poll.isOpen && setDisabledButton(!!(poll.endsAt && new Date(poll.endsAt) <= new Date()));
  }, [poll]);

  return (
    <Fragment>
      <div className={
        style['header'] + ' ' +
        // true => the user is the author of the poll
        (userIsAuthor ? 
          !!poll.isOpen ? 
          style['owner-open-poll-header'] : 
          style['owner-close-poll-header'] : 
            !!poll.isOpen ? style['opened-poll'] : 
            style['closed-poll']
        ) 
      }>
        {
          userIsAuthor ? (
            <button 
              type={'button'} 
              className={
                style['release-poll-btn'] + ' ' +
                (disabledButton || (poll.isOpen && endDate && endDate <= new Date()) ? style['disabled'] : '')
              }
              onClick={handleStartPollClick}
              disabled={isUpdating || (poll.isOpen && endDate && endDate <= new Date()) || disabledButton}
            >
              {isUpdating ? <Spinner color={'white'}/> : poll.isOpen ? 'START POLL' : 'CLOSE POLL'}
            </button>
          ) : null
        }
        <PollNameInput 
          init={poll.name} 
          onChange={handleNameChange}
          updatable={userIsAuthor && !!poll.isOpen} // this should be based on the ownership of the poll
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
              className={isInvalidDate || (poll.endsAt && new Date(poll.endsAt) <= new Date()) ? style['invalid-date'] : ''}
              type='datetime-local' 
              value={endDate ? getInitEndDate(endDate.toString()) : ''}
              min={`${now.getFullYear()}-${now.getMonth() < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1}-${now.getDate()}T${now.getHours()}:${now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()}`}
              max={new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split(':', 2).join(':')} 
              onChange={e => handleEndDateChange(e.target.value)}
              disabled={!isDateUpdated || isUpdating}
            />
          </div>) : 
          (
            <div className={style['end-date']}>
              <div>Ends On: </div>
              <div>
                {new Date(poll.endsAt ?? '').toLocaleString([], {dateStyle: 'full', timeStyle: 'short'})}
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
  votable: boolean,
  isUpdating: boolean
  onVote: () => void}> = ({movie, progress, votes, isOpenPoll, pollId, voted, votable, isUpdating, onVote}) => {
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
              <button 
                className={style['delete-movie-btn'] + ' ' + (isUpdating ? style['disabled'] : '')} 
                onClick={handleDelete}
                disabled={isUpdating}
              >
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
                  ((voted === VOTE_STATUS.VOTING && !movieVoted) || isUpdating ? style['disabled'] : '') 
                } 
                onClick={handleVote}
                disabled={voted === VOTE_STATUS.VOTING || isUpdating}
              >
                {
                  voted === VOTE_STATUS.VOTING && movieVoted ? (
                    <Spinner color={'white'}/>
                  ) : 'VOTE FOR THIS MOVIE'
                }
              </button>
            )
          }
          {
            !isOpenPoll ? (
              <div className={style['movie-poll-result']}>
                <div className={style['movie-poll-result-title']}>
                  Poll result for this movie: 
                </div>
                <MovieResult 
                  progress={Math.trunc(Math.random()*100)}
                  votes={Math.trunc(Math.random()*100)} 
                />
              </div>  
            ) : null
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

const PollAuthor: React.FC<{
  name: string | undefined, 
  photoURL: string | undefined}> = ({name, photoURL}) => {
  return (
    <div className={style['poll-author-component']}>
      <div className={style['author-photo-container']}>
        <img src={photoURL} alt={name} className={style['author-photo']} />
        <div className={style['author-petition']}>
          <div className={style['author-name']}>{name}</div>
          <div className={style['author-petition-text']}>would like you to participate in this poll.</div>
        </div>        
      </div>
    </div>
  );
};

const PollTokens: React.FC<{
  tokens: IToken[] | undefined,
  pollId: number
}> = ({tokens, pollId}) => {
  const dispatch = useDispatch();
  const [tokensHidden, setTokensHidden] = useState(true);

  const handleAddTokenClick = () => {
    dispatch(addToken({pollId: pollId}));
  }

  return (
    <div className={style['poll-tokens-component']}>
      <div className={style['tokens-component-header']}>
        <div className={style['tokens-component-header-title']}>Poll Tokens</div>
        <button 
          onClick={e => setTokensHidden(state => !state)} 
          className={style['tokens-component-header-show-btn']}
        >
          <ChevronVector />
        </button>
      </div>
      <ol className={style['tokens-container']}>
        {
          tokens && tokens.length !== 0 ? (
            tokens.map((token, idx) => (
              <li key={idx}>
                <div key={token.uuid} className={style['token-container']}>
                  <div className={style['token-link-icon']}>
                    <LinkVector />
                  </div>
                  <div className={style['token']}>{`${window.location.host}/poll?id=${pollId}&tid=${token.uuid}`}</div>
                  <div 
                    className={
                      style['token-status'] + ' ' +
                      (token.used ? style['token-used'] : '')
                    }
                  >
                    {token.used ? 'USED' : 'NOT USED'}
                  </div>
                  <button className={style['remove-token-btn']}>
                    <DeleteVector />
                  </button>
                  <button className={style['copy-token-btn']}>
                    <CopyVector />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <div className={style['token-empty-list-container']}>
              Add tokens to share with others and let them vote.
            </div>
          )
        }
      </ol>
      <button
        onClick={handleAddTokenClick} 
        className={style['add-token-btn']}
      >
        Add New Token
      </button>
    </div>
  )
};

const Poll: React.FC = () => {
  const [id, setId] = useState<number | null>(null);
  const [poll, setPoll] = useState<IPoll | null>(null);
  const polls = useSelector(pollsSelector);
  const location = useLocation(); 
  const [totalVotes, setTotalVotes] = useState(0);
  const [voted, setVoted] = useState<VOTE_STATUS>(VOTE_STATUS.NOT_FETCHED); // change to NOT_FETCHED
  const [author, setAuthor] = useState<{
    name: string | undefined,
    photoURL: string | undefined, 
    uid: string}>();
  const userAuthenticationStatus = useSelector(userAuthenticationStatusSelector);
  const [isOpen, setIsOpen] = useState<boolean | undefined>();
  const dispatch = useDispatch();
  // const history = useHistory();
  
  // when this component loads it does with a token
  // if the token is used then the poll must be considered 
  // as voted by the user.

  const changeStatusClbk = () => {
    if (
      poll && 
      poll.endsAt && 
      poll.isOpen &&
      new Date(poll.endsAt) <= new Date()
    ) {
      return;
    }
    
    setIsOpen(state => typeof state !== 'undefined' ? !state : state);
  }

  useEffect(() => {
    poll &&
    poll.id &&
    typeof isOpen !== 'undefined' &&
    poll.endsAt &&
    isOpen !== poll.isOpen &&
    (!poll.isOpen ? true : new Date(poll.endsAt) > new Date()) &&
    author?.uid === getUser()?.uid && 
    dispatch(patchPoll({id: poll.id, pollPatch: {isOpen: isOpen}}));
  }, [dispatch, poll, isOpen, author]);

  useEffect(() => {
    id !== null && 
    userAuthenticationStatus !== USER_AUTHENTICATION_STATUS.ERROR_RETRIVING && 
    userAuthenticationStatus !== USER_AUTHENTICATION_STATUS.NOT_FETCHED &&
    PollService.getPollAuthor(id).then(res => setAuthor(res));
  }, [id, userAuthenticationStatus]);

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
    setIsOpen(state => poll === null || typeof poll === 'undefined' ? state : typeof poll.id === 'undefined' ? state : poll.isOpen);
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
            <PollAuthor name={author?.name} photoURL={author?.photoURL} />
            { /* author ? getUser()?.uid !== author.uid ? <PollAuthor name={author.name} photoURL={author.photoURL} /> : null : null */} 
            <Header 
              poll={poll} 
              changeStatusClbk={changeStatusClbk}
              isUpdating={isOpen !== poll.isOpen}
              userIsAuthor={!!(author && getUser()?.uid === author.uid)}
            />
            {
              !poll.isOpen && author && getUser()?.uid === author.uid ? (
                <PollTokens
                  pollId={poll.id}
                  tokens={poll.tokens}
                />
              ) : null
            }
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
                    votable={!poll.isOpen && !!author && getUser()?.uid !== author.uid}
                    isUpdating={isOpen !== poll.isOpen}
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