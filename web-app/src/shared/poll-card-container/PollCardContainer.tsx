import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { pollsSelector } from '../../services/slices-selectors/polls';
import { IPoll } from '../interfaces/movie-poll-types';
import PollCard from '../poll-card/PollCard';
import style from './PollCardContainer.module.scss';
import {ReactComponent as ArrowLeftVector} from '../resources/vectors/arrow-left.svg';
import {ReactComponent as ArrowRightVector} from '../resources/vectors/arrow-right.svg';

interface IPollCardContainer {
  status: 'current' | 'open'
}

const initialPolls: IPoll[] = [{
  id: 1,
  name: '',
  movies: [{movieId: 1}, {movieId: 2}, {movieId: 3}, {movieId: 4}, {movieId: 5}]
}, {
  id: 2,
  name: '',
  movies: [{movieId: 1}, {movieId: 2}, {movieId: 3}, {movieId: 4}, {movieId: 5}]
},{
  id: 3,
  name: '',
  movies: [{movieId: 1}, {movieId: 2}, {movieId: 3}, {movieId: 4}, {movieId: 5}]
}];

const sortByCreateAt = (a: IPoll, b: IPoll) => {
  if (!a.createdAt || !b.createdAt)
    return 0;

  // createAt can be of type Date or string!!!!
  return Date.parse(a.createdAt as string)  - Date.parse(b.createdAt as string);
}

const PollCardContainer: React.FC<IPollCardContainer> = (props: IPollCardContainer) => {
  const [amount, setAmount] = useState(0); // should be 0 or null when mounting
  const [selectedPolls, setSelectedPolls] = useState<IPoll[] | null>(null);
  const [polls, setPolls] = useState<IPoll[] | null>(null);

  const originalPolls = useSelector(pollsSelector);

  const handleControlClick = (direction: 'back' | 'forward') => {
    if (direction === 'back') {
      setSelectedPolls(state => {
        if (!polls) return state;
        
        const idx = polls.findIndex(poll => state && poll.id === state[0].id);
        
        if (idx === 0) return state;
        
        const start = idx - amount < 0 ? 0 : idx - amount;
        const idxs: number[] = [];
        idxs.push(start);
        for (let i = 1; i < amount; i++) {
          if (start + i >= polls.length) break;
          idxs.push(start + i);
        }

        return polls.filter((poll, index) => idxs.includes(index));
      });
    }

    if (direction === 'forward') {
      setSelectedPolls(state => {
        if (!polls || !state) return state;

        const idx = polls.findIndex(poll => state && poll.id === state[0].id);

        if (
          idx === polls.length - 1 ||
          state[state?.length - 1].id === polls[polls.length - 1].id
        ) return state;

        const start = idx + amount >= polls.length ? 
          idx + amount - polls.length : 
          idx + amount;
        const idxs: number[] = [];
        
        idxs.push(start);
        for (let i = 1; i < amount; i++) {
          if (start + i >= polls.length) break;
          idxs.push(start + i); 
        }

        return polls.filter((poll, index) => idxs.includes(index));
      });
    }
  }

  useEffect(() => {
    setPolls(
      originalPolls && 
      Array.from(
        originalPolls
        .filter(poll => typeof poll.isOpen !== 'undefined' && (props.status === 'current' ? !poll.isOpen : poll.isOpen))
      ).sort(sortByCreateAt)
    );
  }, [originalPolls, props.status]);

  useEffect(() => {
    setSelectedPolls(state => polls && polls.slice(0, amount).length !== 0 ? polls.slice(0, amount) : null);
  }, [polls, amount]);

  useEffect(() => {
    const updateAmount = (width: number) => {
      if (width > 768) {
        setAmount(3);
      } else {
        setAmount(1);
      }
    }
    
    updateAmount(document.body.clientWidth);

    const handleResize = () => {
      updateAmount(document.body.clientWidth);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div className={style['poll-card-container-component']}>
      <div className={style['header']}>
        <div className={style['title']}>Current Polls</div> 
        {
          polls && selectedPolls ? (
            <div className={style['controls']}>
              <button
                onClick={e => handleControlClick('back')}
                title={'Next Polls'}
                disabled={
                  selectedPolls[0].id === polls[0].id ||
                  amount >= polls.length
                }
                className={
                  style['arrow'] + ' ' +
                  ((
                    selectedPolls[0].id === polls[0].id ||
                    amount >= polls.length
                  ) ? style['disabled'] : '')
                }
              >
                <ArrowLeftVector />
              </button>
              <button
                onClick={e => handleControlClick('forward')}
                title={'Next Polls'} 
                disabled={
                  selectedPolls[selectedPolls.length - 1].id === polls[polls.length - 1].id ||
                  amount >= polls?.length
                }
                className={
                  style['arrow'] + ' ' +
                  ((                  
                    selectedPolls[selectedPolls.length - 1].id === polls[polls.length - 1].id ||
                    amount >= polls?.length
                  ) ? style['disabled'] : '')              
                }
              >
                <ArrowRightVector />
              </button>
          </div>
          ) : null
        }
      </div>
      <div className={style['poll-card-container']}>
      {
        (selectedPolls ? selectedPolls : Array.from(initialPolls).slice(0, amount)).map(poll => (
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