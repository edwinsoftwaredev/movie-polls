import { Action } from "@reduxjs/toolkit";
import { Epic, ofType } from "redux-observable";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { IMoviesByGenre } from "../../shared/interfaces/movie-types";
import Axios from 'axios';

enum ActionTypes {
  SAVE_TOPMOVIES = 'topMovies/setTopMovies',
  FETCH_TOPMOVIES = 'topMovies/fetchTopMovies'
};

export interface ITopMoviesParams {
  year: string;
} 

interface ISetTopMoviesAction extends Action {
  type: ActionTypes.SAVE_TOPMOVIES;
  payload: IMoviesByGenre[];
} 

interface IFetchTopMoviesAction extends Action {
  type: ActionTypes.FETCH_TOPMOVIES;
  payload: ITopMoviesParams
}

const setTopMovies = (movies: IMoviesByGenre[]): ISetTopMoviesAction => ({
  type: ActionTypes.SAVE_TOPMOVIES,
  payload: movies
});

export const fetchTopMovies = (payload: ITopMoviesParams): IFetchTopMoviesAction => ({
  type: ActionTypes.FETCH_TOPMOVIES,
  payload: payload
});

export type TopMoviesAction = ISetTopMoviesAction | IFetchTopMoviesAction;

export const fetchTopMoviesEpic: Epic<TopMoviesAction> = (
  action$: Observable<TopMoviesAction>
): Observable<TopMoviesAction> => action$.pipe(
  ofType<TopMoviesAction, IFetchTopMoviesAction>(ActionTypes.FETCH_TOPMOVIES),
  switchMap(async (action: IFetchTopMoviesAction) => {
    const res = await Axios.get(`${process.env.REACT_APP_API_SERVER}/api/movies/top-movies-year`, {
      params: {
        year: action.payload.year
      }
    });

    return setTopMovies(res.data);
  })
);