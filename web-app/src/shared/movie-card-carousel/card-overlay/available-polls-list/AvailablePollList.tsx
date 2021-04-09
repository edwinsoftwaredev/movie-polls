import React, { useEffect, useRef, useState } from 'react';
import style from './AvailablePollList.module.scss';
import {ReactComponent as ChevronDownVector} from '../../../resources/vectors/chevron-down.svg';
import {ReactComponent as PlusVector} from '../../../resources/vectors/plus.svg';
import {ReactComponent as CheckVector} from '../../../resources/vectors/check.svg';
import { useDispatch, useSelector } from 'react-redux';
import { pollsSelector } from '../../../../services/slices-selectors/polls';
import { addMovie } from '../../../../services/epics/polls';
import { IMovie } from '../../../interfaces/movie-types';
import Spinner from '../../../spinners/Spinners';

interface IAvailablePollList {
  movie: IMovie
}

// icons from https://feathericons.com/
const AvailablePollList: React.FC<IAvailablePollList> = (props: IAvailablePollList) => {
  const [activePoll, setActivePoll] = useState<number>(-2);
  const refElement = useRef<Element>();
  const dispatch = useDispatch();
  const polls = useSelector(pollsSelector);
  // sPollId = Submitted Poll Id
  const [sPollId, setSPollId] = useState<number>();

  const handleChevronDownClick = (id: number, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const el = e.currentTarget.nextElementSibling?.nextElementSibling;
    setActivePoll(activePoll => {
      // By doing this the css animations are not executed when the component
      // load or mount
      if (el) {
        if (refElement.current && id !== activePoll) {
          refElement.current.className =
            refElement.current.className.replace(style['active'], style['inactive']);
          refElement.current = el;
        }   

        if (!refElement.current)
          refElement.current = el;

        if (id !== activePoll) {
          el.className = el.className + ' ' + style['active'];
        } else {
          el.className = el.className.replace(style['active'], style['inactive']);
        }
      }

      return id === activePoll ? -1 : id;
    });
  };

  useEffect(() => {
    return () => {
      refElement.current = undefined;
    };
  }, []);

  const handleAddMovie = (pollId: number) => {
    setSPollId(pollId);
    dispatch(addMovie({pollId: pollId, movieId: props.movie.id}));
  };

  useEffect(() => {
    setSPollId(undefined);
  }, [polls]);

  return (
    <div className={style['available-polls-list-component']}>
      {
        !polls ? (
          <Spinner />
        ) : null
      }
      {
        (polls?.filter(item => item.id && item.isOpen).length === 0) ? (
            <div className={style['no-polls-text']}>Create a Poll to Add It Here</div>
          ) : null
      }
      {
        // all polls with id are stored in db.
        polls?.filter(item => item.id && item.isOpen).map(item => (
          <div key={item.id} className={style['poll-item-container']}>
            <div className={
                style['poll-item'] + ' ' +
                (activePoll === item.id ? style['active'] : '') 
              }
            >
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
                onClick={e => handleChevronDownClick(item.id as number, e)}
              >
                <ChevronDownVector />
              </div>
              <div
                title='Add this movie to this poll'
                className={
                  style['add-btn'] + ' ' + 
                  style['btn'] + ' ' +
                  (
                    sPollId === item.id || 
                    item.movies.find(movie => movie.movieId === props.movie.id) ? 
                    style['inactive'] : ''
                  )
                }
                onClick={e => 
                  sPollId !== item.id && !item.movies.find(movie => movie.movieId === props.movie.id) ? 
                  handleAddMovie(item.id as number) : null
                }
              >
                {
                  sPollId === item.id ? 
                    <Spinner /> : 
                    item.movies.find(movie => movie.movieId === props.movie.id) ? 
                      <CheckVector /> : 
                      <PlusVector />
                }
              </div>
              <div 
                className={
                  style['poll-item-detail']
                }
              >
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
            <hr />
          </div>
        ))
      }
    </div>
  );
};

export default AvailablePollList;