import { Action } from "@reduxjs/toolkit";
import { IMovie } from "../../shared/interfaces/movie-types";
import { ActionsObservable, Epic, ofType } from 'redux-observable';
import { Observable } from "rxjs";
import { switchMap } from 'rxjs/operators';
import Axios from 'axios';

enum ActionTypes {
  SAVE_TOP10MOVIES = 'top10Movies/setTop10Movies',
  FETCH_TOP10MOVIES = 'top10Movies/fetchTop10Movies'
}

interface ISetTop10MoviesAction extends Action {
  type: ActionTypes.SAVE_TOP10MOVIES,
  payload: IMovie[]
}

interface IFetchTop10MoviesAction extends Action {
  type: ActionTypes.FETCH_TOP10MOVIES
}

const setTop10Movies = (movies: IMovie[]): ISetTop10MoviesAction => (
  {type: ActionTypes.SAVE_TOP10MOVIES, payload: movies}
);
export const fetchTop10Movies = (): IFetchTop10MoviesAction => (
  {type: ActionTypes.FETCH_TOP10MOVIES}
);

export type Top10MoviesActions = ISetTop10MoviesAction | IFetchTop10MoviesAction;

export const fetchTop10MoviesEpic: Epic<Top10MoviesActions> = 
  (
    action$: ActionsObservable<Top10MoviesActions>
  ): Observable<Top10MoviesActions> => action$.pipe(
    ofType<Top10MoviesActions, IFetchTop10MoviesAction>(ActionTypes.FETCH_TOP10MOVIES),
    switchMap(async (action: IFetchTop10MoviesAction) => {
      const res = await Axios.get(`${process.env.REACT_APP_API_SERVER}/api/movies/top-movies`);
      return setTop10Movies(res.data);
    })
  );