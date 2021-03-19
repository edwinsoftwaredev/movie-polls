import { Action } from "@reduxjs/toolkit";
import { IMovie } from "../../shared/interfaces/movie-types";
import { ActionsObservable, Epic, ofType } from 'redux-observable';
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import Axios from 'axios';

enum ActionTypes {
  SAVE_NOWPLAYING = 'nowPlaying/setMovies',
  FETCH_NOWPLAYING = 'nowPlaying/fetchNowPlaying'
}

interface ISetNowPlayingAction extends Action {
  type: ActionTypes.SAVE_NOWPLAYING,
  payload: IMovie[]
}

interface IFetchNowPlayingAction extends Action {
  type: ActionTypes.FETCH_NOWPLAYING
}

const setNowPlaying = (movies: IMovie[]): ISetNowPlayingAction => ({
  type: ActionTypes.SAVE_NOWPLAYING, payload: movies
});

export const fetchNowPlaying = (): IFetchNowPlayingAction => ({
  type: ActionTypes.FETCH_NOWPLAYING
});

export type NowPlayingActions = ISetNowPlayingAction | IFetchNowPlayingAction;

export const fetchNowPlayingEpic: Epic<NowPlayingActions> = (
  action$: ActionsObservable<NowPlayingActions>
): Observable<NowPlayingActions> => action$.pipe(
  ofType<NowPlayingActions, IFetchNowPlayingAction>(ActionTypes.FETCH_NOWPLAYING),
  switchMap(async (action: IFetchNowPlayingAction) => {
    const res = await Axios.get(`${process.env.REACT_APP_API_SERVER}/api/movies/now-playing`);
    return setNowPlaying(res.data);
  })
);