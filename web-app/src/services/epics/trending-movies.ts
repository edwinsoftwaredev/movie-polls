import { Action } from "@reduxjs/toolkit";
import { ActionsObservable, Epic, ofType } from "redux-observable";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { IMovie, IMoviesByGenre } from "../../shared/interfaces/movie-types";
import Axios from 'axios';

enum ActionTypes {
  SAVE_TOP10TRENDING = 'top10Trending/setMovies',
  FETCH_TOP10TRENDING = 'top10Trending/fetchTop10Trending',
  SAVE_TRENDING = 'trending/setTrending',
  FETCH_TRENDING = 'trending/fetchTrending'
}

interface ISetTop10TrendingAction extends Action {
  type: ActionTypes.SAVE_TOP10TRENDING,
  payload: IMovie[]
}

interface IFetchTop10TrendingAction extends Action {
  type: ActionTypes.FETCH_TOP10TRENDING
}

const setTop10Trending = (movies: IMovie[]): ISetTop10TrendingAction => (
  {type: ActionTypes.SAVE_TOP10TRENDING, payload: movies}
);
export const fetchTop10Trending = (): IFetchTop10TrendingAction => (
  {type: ActionTypes.FETCH_TOP10TRENDING}
);

export type Top10TrendingActions = ISetTop10TrendingAction | IFetchTop10TrendingAction;

export const fetchTop10TrendingEpic: Epic<Top10TrendingActions> = (
  action$: ActionsObservable<Top10TrendingActions>
): Observable<Top10TrendingActions> => action$.pipe(
  ofType<Top10TrendingActions, IFetchTop10TrendingAction>(ActionTypes.FETCH_TOP10TRENDING),
  switchMap(async (action: IFetchTop10TrendingAction) => {
    const res = await Axios.get(`${process.env.REACT_APP_API_SERVER}/api/movies/top-trending-movies`);
    return setTop10Trending(res.data);
  })
);

interface ISetTrendingAction extends Action {
  type: ActionTypes.SAVE_TRENDING,
  payload: IMoviesByGenre[]
}

interface IFetchTrendingAction extends Action {
  type: ActionTypes.FETCH_TRENDING
}

const setTrending = (trending: IMoviesByGenre[]): ISetTrendingAction => (
  {type: ActionTypes.SAVE_TRENDING, payload: trending}
);

export const fetchTrending = (): IFetchTrendingAction => (
  {type: ActionTypes.FETCH_TRENDING}
);

export type TrendingActions = ISetTrendingAction | IFetchTrendingAction;

export const fetchTrendingEpic: Epic<TrendingActions> = (
  action$: ActionsObservable<TrendingActions>
): Observable<TrendingActions> => action$.pipe(
  ofType<TrendingActions, IFetchTrendingAction>(ActionTypes.FETCH_TRENDING),
  switchMap(async (action: IFetchTrendingAction) => {
    const res = await Axios.get<IMoviesByGenre[]>(`${process.env.REACT_APP_API_SERVER}/api/movies/trending-movies`);
    return setTrending(res.data)
  })
)