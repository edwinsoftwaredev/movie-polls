import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { ActionsObservable, combineEpics, createEpicMiddleware, StateObservable } from "redux-observable";
import { catchError } from "rxjs/operators";
import authSlice from "../auth/auth-slice";
import { fetchNowPlayingEpic, NowPlayingActions } from "../services/epics/now-playing-movies";
import { Top10PopularActions, fetchTop10PopularEpic } from "../services/epics/popular-movies";
import { Top10TrendingActions, fetchTop10TrendingEpic, TrendingActions, fetchTrendingEpic } from "../services/epics/trending-movies";
import { sliderPropertiesSlice } from "../services/slices-selectors/slider-properties";
import {nowPlayingSlice, searchResultSlice, top10PopularSlice, top10TrendingSlice} from '../services/slices-selectors/movies';
import { trendingSlice } from "../services/slices-selectors/trending-movies";
import { topMovies } from "../services/slices-selectors/top-movies";
import { fetchTopMoviesEpic, TopMoviesAction } from "../services/epics/top-movies";
import { pollsSlice } from "../services/slices-selectors/polls";
import { setPollEpic, PollActionTypes, fetchPollsEpic, addMovieEpic, removeMovieEpic, removePollEpic, patchPollEpic, getPublicPollEpic, setVoteEpic } from "../services/epics/polls";
import { fetchSearchResultEpic, SearchMoviesActions } from "../services/epics/search-result-movies";
import { addTokenEpic, removeTokenEpic, TokenActionsTypes } from "../services/epics/token";

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  top10Popular: top10PopularSlice.reducer,
  top10Trending: top10TrendingSlice.reducer,
  nowPlaying: nowPlayingSlice.reducer,
  trending: trendingSlice.reducer,
  topMovies: topMovies.reducer,
  sliderProperties: sliderPropertiesSlice.reducer,
  polls: pollsSlice.reducer,
  searchResult: searchResultSlice.reducer
});

type Actions = Top10PopularActions | 
  Top10TrendingActions | 
  NowPlayingActions | 
  TrendingActions | 
  TopMoviesAction |
  PollActionTypes |
  SearchMoviesActions |
  TokenActionsTypes;

export const rootEpic = (
  action$: ActionsObservable<Actions>,
  store$: StateObservable<any>,
  dependecies: any
) => combineEpics(
  fetchTop10PopularEpic,
  fetchTop10TrendingEpic,
  fetchNowPlayingEpic,
  fetchTrendingEpic,
  fetchTopMoviesEpic,
  setPollEpic,
  fetchPollsEpic,
  addMovieEpic,
  removeMovieEpic,
  removePollEpic,
  fetchSearchResultEpic,
  patchPollEpic,
  addTokenEpic,
  removeTokenEpic,
  getPublicPollEpic,
  setVoteEpic
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
