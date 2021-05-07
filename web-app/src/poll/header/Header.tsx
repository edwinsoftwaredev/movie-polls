import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { patchPoll } from '../../services/epics/polls';
import { IPoll } from '../../shared/interfaces/movie-poll-types';
import Spinner from '../../shared/spinners/Spinners';
import PollNameInput from '../poll-name-input/PollNameInput';
import ProgressBar from '../progress-bar/ProgressBar';
import style from './Header.module.scss';

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
  const [progress, setProgress] = useState(0);
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
    poll.isOpen && poll.movies.length >= 2 && setDisabledButton(!!(poll.endsAt && new Date(poll.endsAt) <= new Date()));
    changeStatusClbk();
  };

  useEffect(() => {
    const totalVotes = poll.movies.map(movie => movie.voteCount ?? 0).reduce((acc, curr) => acc + curr) ?? 0;
    const tokenQty = poll.tokenQty;
    setProgress(tokenQty ? Math.ceil((totalVotes / tokenQty)*100) : 0);
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
                (disabledButton || 
                  (poll.isOpen && endDate && endDate <= new Date()) || 
                  typeof endDate === 'undefined' || poll.movies.length <= 1 ||
                  endDate === null ? style['disabled'] : '')
              }
              onClick={handleStartPollClick}
              disabled={
                isUpdating || 
                (poll.isOpen && endDate && endDate <= new Date()) || 
                disabledButton || 
                typeof endDate === 'undefined' ||
                endDate === null ||
                poll.movies.length <= 1
              }
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
              progress={progress}
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
          </div>) : poll.endsAt && new Date(poll.endsAt) > new Date() ?
          (
            <div className={style['end-date']}>
              <div>Ends On: </div>
              <div>
                {new Date(poll.endsAt ?? '').toLocaleString([], {dateStyle: 'full', timeStyle: 'short'})}
              </div>
            </div>
          ) : (
            <div className={style['ended-date']}>
              <div>Ended On: </div>
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

export default Header;