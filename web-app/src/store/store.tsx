import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { ActionsObservable, combineEpics, createEpicMiddleware, StateObservable } from "redux-observable";
import { catchError } from "rxjs/operators";
import authSlice from "../auth/auth-slice";
import { fetchNowPlayingEpic, NowPlayingActions } from "../services/epics/now-playing-movies";
import { Top10PopularActions, fetchTop10PopularEpic } from "../services/epics/popular-movies";
import { Top10TrendingActions, fetchTop10TrendingEpic } from "../services/epics/trending-movies";
import {nowPlayingSlice, top10PopularSlice, top10TrendingSlice} from '../services/slices-selectors/movies';

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  top10Popular: top10PopularSlice.reducer,
  top10Trending: top10TrendingSlice.reducer,
  nowPlaying: nowPlayingSlice.reducer
});

type Actions = Top10PopularActions | Top10TrendingActions | NowPlayingActions;

export const rootEpic = (
  action$: ActionsObservable<Actions>,
  store$: StateObservable<any>,
  dependecies: any
) => combineEpics(
  fetchTop10PopularEpic,
  fetchTop10TrendingEpic,
  fetchNowPlayingEpic
)(action$, store$, dependecies).pipe(catchError((error, source) => {
  console.log(error);
  return source;
}));

const epicMiddleware = createEpicMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: [epicMiddleware]
});

epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof rootReducer>;
export default store;
