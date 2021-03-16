import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMovie } from '../../shared/interfaces/movie-types';
import { RootState } from '../../store/store';

const initialTop10Movies: IMovie[] = new Array(10).map((value, index) => {
  return {title: '', id: index} as IMovie;
});

export const top10MoviesSlice = createSlice({
  name: 'top10Movies',
  initialState: initialTop10Movies,
  reducers: {
    setTop10Movies: (state: IMovie[], action: PayloadAction<IMovie[]>) => {
      state = action.payload;
      return state;
    }
  }
});

export const top10MoviesSelector = createSelector(
  (state: RootState) => state.top10Movies,
  (res: IMovie[]) => res
);