import React, { Fragment, useEffect, useRef, useState } from 'react';
import style from './Search.module.scss';
import {ReactComponent as SearchVector} from '../shared/resources/vectors/search.svg';
import { useHistory } from 'react-router';
import Spinner from '../shared/spinners/Spinners';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchResult } from '../services/epics/search-result-movies';
import { searchResultSelector } from '../services/slices-selectors/movies';
import MovieCard from '../shared/movie-card/MovieCard';
import CardOverlayPortal from '../shared/movie-card-carousel/card-overlay/card-overlay-portal/CardOverlayPortal';

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

const NoResults: React.FC<any> = ({isEmpty}) => {
  return (
    <div className={style['no-result-component']}>
      <div className={style['no-result-container']}>
        <div className={style['text']}>
          {
            isEmpty ? 
              'Your search did not return any results.' : 
              'Your search results will be shown here.'
          }
        </div>
      </div>
    </div>
  )
}

const SearchResult: React.FC = () => {
  const searchResult = useSelector(searchResultSelector);
  const [activeCard, setActiveCard] = useState<HTMLDivElement | undefined | null>();
  const [activeMovie, setActiveMovie] = useState<any>();

  const handleOverlay = (card: HTMLDivElement | undefined | null, movie: any) => {
    setActiveCard(card);
    setActiveMovie((state: any) => searchResult ? searchResult.find(item => item.id === movie.id) : state);
  };

  const clearCardOverlay = () => {
    setActiveCard(null);
    setActiveMovie(null);
  }
  
  return (
    <div className={style['search-result-component']}>
      <CardOverlayPortal 
        activeCard={activeCard}
        activeMovie={activeMovie}
        clearCardOverlay={clearCardOverlay}
      />
      <div className={style['movie-cards-container']}>
        {
          searchResult && searchResult.length === 0 ? <NoResults isEmpty={true}/> : null
        }
        {
          !searchResult ? <NoResults isEmpty={false} /> : null
        }
        {
          searchResult && searchResult.map(movie => (
            <Fragment key={movie.id}>
              <MovieCard movie={movie} handleOverlay={handleOverlay} />
            </Fragment>
          ))
        }        
      </div>
    </div>
  );
}

const Search: React.FC = () => {
  // id sliders-container should be renamed
  return (
    <div 
      id='sliders-container' 
      className={style['search-component'] + ' ' + style['sliders-container']
    }>
      <SearchField />
      <SearchResult />
    </div>
  )
};

export default Search;