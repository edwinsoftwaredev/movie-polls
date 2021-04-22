import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { pollsSelector } from '../services/slices-selectors/polls';
import { IPoll } from '../shared/interfaces/movie-poll-types';
import PollCard from '../shared/poll-card/PollCard';
import style from './MyPolls.module.scss';

const sortByCreateAt = (a: IPoll, b: IPoll) => {
  if (!a.createdAt || !b.createdAt)
    return 0;

  // createAt can be of type Date or string!!!!
  return Date.parse(a.createdAt as string)  - Date.parse(b.createdAt as string);
}

const MyPolls: React.FC = () => {
  const polls = useSelector(pollsSelector);

  return (
    <div
      id='slider-container'
      className={
        style['my-polls-component'] + ' ' + 
        style['sliders-container']
      }
    >
      <div className={style['elements-container']}>
        <div className={style['running-polls-divider']}>
          <div className={style['divider-title']}>Released Polls</div>
          <div className={style['divider-line']}><hr /></div>
        </div>
        <div className={style['polls-container']}>
        {
          Array.from(polls ?? []).sort(sortByCreateAt)?.map(poll => (
            <Fragment key={poll.id}>
              <PollCard poll={poll}/>
            </Fragment>
          ))
        }
        </div>  
        <div className={style['running-polls-divider']}>
          <div className={style['divider-title']}>Not Released Polls</div>
          <div className={style['divider-line']}><hr /></div>
        </div>
        <div className={style['polls-container']}>
        {
          Array.from(polls ?? []).sort(sortByCreateAt).map(poll => (
            <Fragment key={poll.id}>
              <PollCard poll={poll}/>
            </Fragment>
          ))
        }
        </div>
      </div>
    </div>
  );
};

export default MyPolls;