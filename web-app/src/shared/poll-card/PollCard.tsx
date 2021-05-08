import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { deletePoll } from '../../services/epics/polls';
import { IPoll } from '../interfaces/movie-poll-types';
import Spinner from '../spinners/Spinners';
import style from './PollCard.module.scss';
import ProgressBar from './progress-bar/ProgressBar';

interface IPollCard {
  poll: IPoll
}

const PollCard: React.FC<IPollCard> = (props: IPollCard) => {
  const [loadedImages, setLoadedImages] = useState<{pollId: number; movieId: number}[] | null>(null); 
  const [progress, setProgress] = useState(0);
  const isPoll = props.poll.movies.filter(movie => movie.movie).length !== 0;
  const [removing, setRemoving] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const handlePollClick = () => {
    isPoll && !removing && history.push({
      pathname: `/poll/${props.poll.id}`
    });
  };

  const handleRemove = () => {
    setRemoving(true);
    props.poll.id && dispatch(deletePoll(props.poll.id));
  };

  useEffect(() => {
    setProgress(
      props.poll.tokenQty ? 
      Math.ceil(
        (
          props.poll.movies
          .map(movie => movie.voteCount ?? 0)
          .reduce((acc, curr) => acc + curr) / props.poll.tokenQty
        ) * 100
      ) : 0
    );
  }, [props.poll]);

  return (
    <div className={style['poll-card-component'] + ' ' + (!isPoll ? style['disabled'] : '')} onClick={handlePollClick}>
      {
        !isPoll ? (
          <div className={style['not-a-poll']}>
            Running Polls are Showed Here
          </div>
        ) : null
      }
      <div className={style['data'] + ' ' + (typeof props.poll.isOpen !== 'undefined' && props.poll.isOpen ? style['no-poll'] : '')}>
        {
          isPoll ? (
            <div title={props.poll.name ?? ''} className={style['poll-name'] + ' ' + (!props.poll.name ? style['empty'] : null)}>
              <div>{props.poll.name}</div>
            </div>
          ) : <div></div>
        }
        {
          typeof props.poll.isOpen !== 'undefined' && !props.poll.isOpen ? (
            <Fragment>
              <div className={style['date-time']}>
                <div className={style['date']}>{props.poll.endsAt ? new Date(props.poll.endsAt).toDateString() : ''}</div>
                <div className={style['time']}>{props.poll.endsAt ? new Date(props.poll.endsAt).toLocaleTimeString([], {timeStyle: 'short'}) : ''}</div>
              </div>
            </Fragment>
          ) : (
            isPoll ? 
            <Fragment>
              <button 
                className={style['remove-poll-btn']}
                onClick={e => {e.stopPropagation(); handleRemove();}}
                disabled={removing}
              >
                {removing ? <Spinner color={'red'} /> : 'Remove Poll'}
              </button>
            </Fragment> : null
          )
        }        
      </div>
      {
        typeof props.poll.isOpen !== 'undefined' && !props.poll.isOpen ? (
          <ProgressBar progress={progress} />
        ) : null
      }
      <div className={style['movies-container']}>
        {
          props.poll.movies.map(movie => (
            <div key={movie.movieId} className={style['movie-container']}>
              {
                movie.movie ? (
                  <img 
                    onLoad={e => setLoadedImages(state => {
                      if (!props.poll.id)
                        return state;

                      if (state)
                        return [...state, {pollId: props.poll.id, movieId: movie.movieId}];
                      
                      return [{pollId: props.poll.id, movieId: movie.movieId}];
                    })}
                    title={movie.movie?.title}
                    alt={movie.movie?.title}
                    className={
                      style['poster'] + ' ' +
                      (loadedImages?.filter(obj => 
                        obj.movieId === movie.movieId && obj.pollId === props.poll.id
                        ).length === 1 ? style['loaded'] : ''
                      )
                    } 
                    src={`${process.env.REACT_APP_TMDB_API_POSTER_URL}${movie.movie?.poster_path}`}
                  />
                ) : (
                  <div className={style['empty-poster']}>
                  </div>
                )
              }
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default PollCard;