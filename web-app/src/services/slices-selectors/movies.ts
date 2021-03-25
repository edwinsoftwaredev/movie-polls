import { createSelector, createSlice, PayloadAction, Slice } from '@reduxjs/toolkit';
import { IMovie } from '../../shared/interfaces/movie-types';
import { RootState } from '../../store/store';

const initialMovies: IMovie[] = [...new Array(10)].map((value, index) => {
  return {title: '', id: index} as IMovie;
});

const generateSlice = (name: string): Slice<IMovie[]> => {
  return createSlice({
    name: name,
    initialState: initialMovies,
    reducers: {
      setMovies: (state: IMovie[], action: PayloadAction<IMovie[]>) => {
        state = action.payload;
        return state;
      }
    }
  });
};

export const top10PopularSlice = generateSlice('top10Popular');
export const top10TrendingSlice = generateSlice('top10Trending');
export const nowPlayingSlice = generateSlice('nowPlaying');

export const top10PopularSelector = createSelector(
  (state: RootState) => state.top10Popular,
  (res: IMovie[]) => res
);

export const top10TrendingSelector = createSelector(
  (state: RootState) => state.top10Trending,
  (res: IMovie[]) => res
);

export const nowPlayingSelector = createSelector(
  (state: RootState) => state.nowPlaying,
  (res: IMovie[]) => res
);