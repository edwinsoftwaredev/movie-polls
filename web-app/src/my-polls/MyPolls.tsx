import React, { Fragment, useEffect, useState } from 'react';
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
  const [openPolls, setOpenPolls] = useState<IPoll[]>([]);
  const [runningPolls, setRunnigPolls] = useState<IPoll[]>([]);

  useEffect(() => {
    polls && 
    setOpenPolls(
      Array.from(polls)
        .filter(poll => typeof poll.isOpen !== 'undefined' && poll.isOpen)
        .sort(sortByCreateAt)
    );

    polls &&
    setRunnigPolls(
    Array.from(polls)
      .filter(poll => typeof poll.isOpen !== 'undefined' && !poll.isOpen)
      .sort(sortByCreateAt)
    );
  }, [polls]);

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
          <div className={style['divider-title']}>Running Polls</div>
          <div className={style['divider-line']}><hr /></div>
        </div>
        <div className={style['polls-container']}>
        {
          runningPolls.length !== 0 ? 
          runningPolls
          .map(poll => (
            <Fragment key={poll.id}>
              <PollCard poll={poll}/>
            </Fragment>
          )) : (
            <div className={style['no-polls']}>
              Your Running Polls are Showed Here
            </div>
          )
        }
        </div>  
        <div className={style['running-polls-divider']}>
          <div className={style['divider-title']}>Not Running Polls</div>
          <div className={style['divider-line']}><hr /></div>
        </div>
        <div className={style['polls-container']}>
        {
          openPolls.length !== 0 ?
          openPolls
          .map(poll => (
            <Fragment key={poll.id}>
              <PollCard poll={poll}/>
            </Fragment>
          )) : (
            <div className={style['no-polls']}>
              Your Not Runnning Polls are Showed Here
            </div>
          )
        }
        </div>
      </div>
    </div>
  );
};

export default MyPolls;