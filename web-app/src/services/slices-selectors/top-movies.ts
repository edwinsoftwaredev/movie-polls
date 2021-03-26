import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMovie, IMoviesByGenre } from "../../shared/interfaces/movie-types";
import { RootState } from "../../store/store";

const initialState: IMoviesByGenre[] = [...new Array(10)].map(_ => {
  return {
    genre_name: '',
    results: [...new Array(10)].map((value, index) => {
      return {title: '', id: index} as IMovie;
    })
  } as IMoviesByGenre;
});

export const topMovies = createSlice({
  name: 'topMovies',
  initialState: initialState,
  reducers: {
    setTopMovies: (state: IMoviesByGenre[], action: PayloadAction<IMoviesByGenre[]>) => {
      state = action.payload;
      return state;
    }
  }
});

export const topMoviesSelector = createSelector(
  (state: RootState) => state.topMovies,
  (res: IMoviesByGenre[]) => res
);