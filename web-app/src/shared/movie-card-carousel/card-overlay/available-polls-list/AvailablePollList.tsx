import React, { useEffect, useState } from 'react';
import style from './AvailablePollList.module.scss';
import {ReactComponent as ChevronDownVector} from '../../../resources/vectors/chevron-down.svg';
import {ReactComponent as PlusVector} from '../../../resources/vectors/plus.svg';
import { useDispatch, useSelector } from 'react-redux';
import { pollsSelector } from '../../../../services/slices-selectors/polls';
import { fetchPolls } from '../../../../services/epics/polls';

// icons from https://feathericons.com/
const AvailablePollList: React.FC = () => {
  const [activePoll, setActivePoll] = useState<number>(-1);
  const dispatch = useDispatch();
  const polls = useSelector(pollsSelector);

  const handleChevronDownClick = (id: number) => {
    setActivePoll(id);
  };

  useEffect(() => {
    // retrive only opened polls
    const opened = true;
    dispatch(fetchPolls(opened));
  }, [dispatch]);

  return (
    <div className={style['available-polls-list-component']}>
      {
        // all polls with id are stored in db.
        polls.filter(item => item.id && item.isOpen).map(item => (
          <div key={item.id} className={style['poll-item-container']}>
            <div className={style['poll-item']}>
              <div className={style['name']}>{item.name}</div>
              <div className={style['counter']}>({item.movies.length})</div>
              <div className={style['space']}></div>
              <div 
                title='Deploy'
                className={
                  style['more-info-btn'] + ' ' +
                  style['btn'] + ' ' +
                  (activePoll === item.id ? style['active'] : '')
                }
                onClick={e => handleChevronDownClick(item.id as number)}
              >
                <ChevronDownVector />
              </div>
              <div 
                title='Add this movie to this poll'
                className={style['add-btn'] + ' ' + style['btn']}
              >
                <PlusVector />
              </div>
              <div className={
                style['poll-item-detail'] + ' ' +
                (activePoll === item.id ? style['active'] : '')
              }>
                {
                  // replace this by the name of the movie
                  item.movies.map(movie => (
                    <div key={movie.movieId}>
                      {movie.movie?.title ?? 'NO TITLE'}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default AvailablePollList;