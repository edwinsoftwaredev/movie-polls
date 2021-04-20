import { createSelector, createSlice, PayloadAction, Slice } from '@reduxjs/toolkit';
import { IMovie } from '../../shared/interfaces/movie-types';
import { RootState } from '../../store/store';

const initialMovies: IMovie[] = [...new Array(10)].map((value, index) => {
  return {title: '', id: index} as IMovie;
});

const generateSlice = (name: string, nullInitial?: boolean): Slice<IMovie[] | null> => {
  return createSlice({
    name: name,
    initialState: nullInitial ? null : initialMovies,
    reducers: {
      setMovies: (state: IMovie[] | null, action: PayloadAction<IMovie[]>) => {
        state = action.payload;
        return state;
      }
    }
  });
};

export const top10PopularSlice = generateSlice('top10Popular');
export const top10TrendingSlice = generateSlice('top10Trending');
export const nowPlayingSlice = generateSlice('nowPlaying');
export const searchResultSlice = generateSlice('searchResult', true);

export const top10PopularSelector = createSelector(
  (state: RootState) => state.top10Popular as IMovie[],
  (res: IMovie[]) => res
);

export const top10TrendingSelector = createSelector(
  (state: RootState) => state.top10Trending as IMovie[],
  (res: IMovie[]) => res
);

export const nowPlayingSelector = createSelector(
  (state: RootState) => state.nowPlaying as IMovie[],
  (res: IMovie[]) => res
);

export const searchResultSelector = createSelector(
  (state: RootState) => state.searchResult,
  (res: IMovie[] | null) => res
);