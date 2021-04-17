import React, { useEffect, useRef, useState } from 'react';
import style from './Search.module.scss';
import {ReactComponent as SearchVector} from '../shared/resources/vectors/search.svg';
import { useHistory } from 'react-router';
import Spinner from '../shared/spinners/Spinners';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchResult } from '../services/epics/search-result-movies';
import { searchResultSelector } from '../services/slices-selectors/movies';

const SearchField: React.FC = () => {
  const [searchControlObj, setSearchControlObj] = useState<{
    value: string, 
    restartedBounce: boolean
  }>({
    value: '',
    restartedBounce: false
  });
  const history = useHistory();
  const location = useLocation();
  const timeoutRef = useRef<any>();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchControlObj({
      value: e.target.value, 
      restartedBounce: true
    });
  }

  useEffect(() => {
    if (searchControlObj.restartedBounce) {
      clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setSearchControlObj(state => ({...state, restartedBounce: false}));
      }, 700);
    }

    return () => {
      clearTimeout(timeoutRef.current);
    }
  }, [searchControlObj]);

  useEffect(() => {
    if (!searchControlObj.restartedBounce) {
      history.replace({
        search: searchControlObj.value ?`?q=${searchControlObj.value}` : '',
      });
    }
  }, [history, searchControlObj]);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q');
    if (q) {
      dispatch(fetchSearchResult(q));
    }
  }, [location, dispatch]);

  return (
    <div className={style['search-field-component']}>
      <input
        value={searchControlObj.value}
        onChange={e => handleChange(e)} 
        maxLength={150} 
        placeholder={'Title'} 
        className={style['search-input']} 
        type='text' 
      />
      <div className={style['search-vector']}>
        {searchControlObj.restartedBounce ? <Spinner color={'white'} /> : <SearchVector />} 
      </div>
    </div>
  );
};

const Search: React.FC = () => {
  const searchResult = useSelector(searchResultSelector);

  useEffect(() => {
  }, [searchResult]);

  return (
    <div className={style['search-component']}>
      <SearchField />
    </div>
  )
};

export default Search;