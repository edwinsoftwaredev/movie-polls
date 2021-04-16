import React, { useState } from 'react';
import { IPoll } from '../interfaces/movie-poll-types';
import style from './PollCard.module.scss';
import ProgressBar from './progress-bar/ProgressBar';

interface IPollCard {
  poll: IPoll
}

const PollCard: React.FC<IPollCard> = (props: IPollCard) => {
  const [loadedImages, setLoadedImages] = useState<{pollId: number; movieId: number}[] | null>(null);
  const isPoll = props.poll.movies.filter(movie => movie.movie).length !== 0;

  return (
    <div className={style['poll-card-component']}>
      <div className={style['data']}>
        <div className={style['poll-name'] + ' ' + (!props.poll.name ? style['empty'] : null)}>{props.poll.name}</div>
        <div className={style['date']}>{new Date().toDateString()}</div>
        <div className={style['time']}>{new Date().toLocaleTimeString([], {timeStyle: 'short'})}</div>
      </div>
      <ProgressBar progress={isPoll ? Math.trunc(Math.random()*100) : null} /> {/** REMOVE THIS */}
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
                    src={`${process.env.REACT_APP_TMDB_API_POSTER_URL}/${movie.movie?.poster_path}`}
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