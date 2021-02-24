import React from 'react';
import { IPoll } from '../../../interfaces/movie-poll-types';
import style from './AvailablePollList.module.scss';
import {ReactComponent as ChevronDownVector} from '../../../resources/vectors/chevron-down.svg';
import {ReactComponent as PlusVector} from '../../../resources/vectors/plus.svg';


const initialData: IPoll[] = [{
  id: 1,
  name: 'Friday Night',
  movieList: [{
    id: 1,
    title: 'Mulan'
  }, {
    id: 2,
    title: 'Wonder Woman 1984'
  }]
},
{
  id: 2,
  name: 'Saturday Night',
  movieList: [{
    id: 1,
    title: 'Mulan',
  }, {
    id: 3,
    title: 'Tenet'
  }, {
    id: 4,
    title: 'The Old Guard'
  }]
},
{
  id: 3,
  name: 'Saturday Afternoon',
  movieList: [{
    id: 3,
    title: 'Tenet'
  }, {
    id: 5,
    title: 'Soul'
  }]
},
{
  id: 4,
  name: 'Friends Party',
  movieList: [{
    id: 6,
    title: 'Enola Holmes'
  }, {
    id: 7,
    title: 'Extraction'
  }, {
    id: 3,
    title: 'Tenet'
  }]
}];

// icons from https://feathericons.com/
const AvailablePollList: React.FC = () => {
  return (
    <div className={style['available-polls-list-component']}>
      {
        initialData.map(item => (
          <div key={item.id} className={style['poll-item']}>
            <div className={style['name']}>{item.name}</div>
            <div className={style['counter']}>({item.movieList.length})</div>
            <div className={style['space']}></div>
            <div className={style['more-info-btn'] + ' ' + style['btn']}>
              <ChevronDownVector />
            </div>
            <div className={style['add-btn'] + ' ' + style['btn']}>
              <PlusVector />
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default AvailablePollList;