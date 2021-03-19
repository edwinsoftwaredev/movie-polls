import { Action } from "@reduxjs/toolkit";
import { IMovie } from "../../shared/interfaces/movie-types";
import { ActionsObservable, Epic, ofType } from 'redux-observable';
import { Observable } from "rxjs";
import { switchMap } from 'rxjs/operators';
import Axios from 'axios';

enum ActionTypes {
  SAVE_TOP10POPULAR = 'top10Popular/setMovies',
  FETCH_TOP10POPULAR = 'top10Popular/fetchTop10Popular',
}

interface ISetTop10PopularAction extends Action {
  type: ActionTypes.SAVE_TOP10POPULAR,
  payload: IMovie[]
}

interface IFetchTop10PopularAction extends Action {
  type: ActionTypes.FETCH_TOP10POPULAR
}

const setTop10Popular = (movies: IMovie[]): ISetTop10PopularAction => (
  {type: ActionTypes.SAVE_TOP10POPULAR, payload: movies}
);
export const fetchTop10Popular = (): IFetchTop10PopularAction => (
  {type: ActionTypes.FETCH_TOP10POPULAR}
);

export type Top10PopularActions = ISetTop10PopularAction | IFetchTop10PopularAction;

export const fetchTop10PopularEpic: Epic<Top10PopularActions> = 
  (
    action$: ActionsObservable<Top10PopularActions>
  ): Observable<Top10PopularActions> => action$.pipe(
    ofType<Top10PopularActions, IFetchTop10PopularAction>(ActionTypes.FETCH_TOP10POPULAR),
    switchMap(async (action: IFetchTop10PopularAction) => {
      const res = await Axios.get(`${process.env.REACT_APP_API_SERVER}/api/movies/top-popular-movies`);
      return setTop10Popular(res.data);
    })
  );