import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteMovie } from '../../services/epics/polls';
import { IMovieDetail } from '../../shared/interfaces/movie-types';
import Spinner from '../../shared/spinners/Spinners';
import { VOTE_STATUS } from '../../shared/utils/enums';
import MovieResult from '../movie-result/MovieResult';
import style from './Movie.module.scss';

const Movie: React.FC<{
  movie: IMovieDetail,
  progress: number,
  votes: number,
  isOpenPoll: boolean,
  pollId: number,
  voted: VOTE_STATUS,
  votable: boolean,
  isUpdating: boolean,
  userIsAuthor: boolean
  onVote: () => void}> = ({movie, progress, votes, isOpenPoll, pollId, voted, votable, isUpdating, onVote, userIsAuthor}) => {
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
    const getDetails = async () => {
      const hours = Math.floor(movie.runtime / 60);
      const mins = movie.runtime % 60;
      setDuration(hours + 'h ' + mins + 'm');
      movie.credits && setCast(movie.credits.cast.slice(0, 4).map(value => value.name));
      setDirector(movie.credits.crew.filter(value => value.job === 'Director')[0]?.name ?? '');
      setCertificaction(
        movie.release_dates.results
          .filter(value => value.iso_3166_1 === 'US')[0]
          ?.release_dates[0]
          .certification
      )
    };

    const getProviders = async () => {
      setProviders(movie.providers);
    };

    getDetails();
    getProviders();
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
            isOpenPoll && userIsAuthor ? (
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
            !isOpenPoll && userIsAuthor ? (
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

export default Movie;