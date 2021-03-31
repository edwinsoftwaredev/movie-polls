import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {IMovie, IMoviesByGenre} from '../../shared/interfaces/movie-types';
import { RootState } from '../../store/store';

// new Array(10) will return an object without keys(an array without indexes)
// using map directly will not work because it will not iterate because there are not keys.
// using [...new Array(10)] will generate a proper array with indexes. 
const initialState: IMoviesByGenre[] = [...new Array(1)].map((item, idx) => {
  return {
    genre_name: '',
    results: [...new Array(10)].map((value, index) => {
      return {title: '', id: index} as IMovie;
    })
  } as IMoviesByGenre;
});

export const trendingSlice = createSlice({
  name: 'trending',
  initialState: initialState,
  reducers: {
    setTrending: (state: IMoviesByGenre[], action: PayloadAction<IMoviesByGenre[]>) => {
      state = action.payload;
      return state;
    }
  }
});

export const trendingSelector = createSelector(
  (state: RootState) => state.trending,
  (res: IMoviesByGenre[]) => res
);