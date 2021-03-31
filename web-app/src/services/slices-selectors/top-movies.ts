import { Action, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITopMovies } from "../../shared/interfaces/movie-poll-types";
import { IMovie, IMoviesByGenre } from "../../shared/interfaces/movie-types";
import { RootState } from "../../store/store";

const initialState: ITopMovies = {
  filters: {year: ''},
  moviesByGenres: [...new Array(1)].map(_ => (
    {
       genre_name: '',
       results: [...new Array(10)].map((value, index) => {
         return {title: '', id: index} as IMovie;
       })
    } as IMoviesByGenre
  ))
};

export const topMovies = createSlice({
  name: 'topMovies',
  initialState: initialState,
  reducers: {
    setTopMovies: (state: ITopMovies, action: PayloadAction<ITopMovies>) => {
      state = action.payload;
      return state;
    }
  }
});

export const topMoviesSelector = createSelector(
  (state: RootState) => state.topMovies,
  (res: ITopMovies) => res
);

enum ActionTypes {
  SAVE_TOPMOVIES = 'topMovies/setTopMovies'
}
interface ISetInitialTopMoviesAction extends Action {
  type: ActionTypes.SAVE_TOPMOVIES;
  payload: ITopMovies;
} 

export const setInitialTopMovies = (): ISetInitialTopMoviesAction => ({
  type: ActionTypes.SAVE_TOPMOVIES,
  payload: initialState
});