import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { pollsSelector } from '../../services/slices-selectors/polls';
import { IPoll } from '../interfaces/movie-poll-types';
import PollCard from '../poll-card/PollCard';
import style from './PollCardContainer.module.scss';

interface IPollCardContainer {
  status: 'current' | 'open'
}

const initialPolls: IPoll[] = [{
  id: 1,
  name: '',
  movies: [{movieId: 1}, {movieId: 2}, {movieId: 3}, {movieId: 4}, {movieId: 4}]
}, {
  id: 2,
  name: '',
  movies: [{movieId: 1}, {movieId: 2}, {movieId: 3}, {movieId: 4}, {movieId: 4}]
},{
  id: 3,
  name: '',
  movies: [{movieId: 1}, {movieId: 2}, {movieId: 3}, {movieId: 4}, {movieId: 4}]
}];

const PollCardContainer: React.FC<IPollCardContainer> = (props: IPollCardContainer) => {
  const polls = useSelector(pollsSelector);

  return (
    <div className={style['poll-card-container-component']}>
      <div className={style['title']}>Current Polls</div>
      <div className={style['poll-card-container']}>
      {
        (polls ? polls : initialPolls).map(poll => (
          <Fragment key={poll.id}>
            <PollCard poll={poll} />          
          </Fragment>
        ))
      }
      </div>
    </div>
  );
};

export default PollCardContainer;