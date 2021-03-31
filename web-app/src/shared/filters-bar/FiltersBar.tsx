import React from 'react';
import style from './FiltersBar.module.scss';

interface IFiltersBar {
  callbackYear: (year: string) => void;
  intialYear: string;
}

const initYears = [...new Array(25)].map((value, index) => new Date().getFullYear() - index);

const FiltersBar: React.FC<IFiltersBar> = (props: IFiltersBar) => {

  const handleYear = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.callbackYear(event.target.value);
  }

  return (
    <div className={style['filters-bar-container']}>
      <div className={style['filters-container']}>
        <div className={style['year-filter']}>
          <label htmlFor='year-filter'>Year </label>
          <select id='year-filter' onChange={handleYear} defaultValue={props.intialYear}>
            {
              initYears.map(year => <option key={year} value={year}>{year}</option>)
            }
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;