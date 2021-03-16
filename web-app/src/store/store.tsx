import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { ActionsObservable, combineEpics, createEpicMiddleware, StateObservable } from "redux-observable";
import { catchError } from "rxjs/operators";
import authSlice from "../auth/auth-slice";
import { fetchTop10MoviesEpic, Top10MoviesActions } from "../services/epics/movies";
import {top10MoviesSlice} from '../services/slices-selectors/movies';

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  top10Movies: top10MoviesSlice.reducer
});

type Actions = Top10MoviesActions;

export const rootEpic = (
  action$: ActionsObservable<Actions>,
  store$: StateObservable<any>,
  dependecies: any
) => combineEpics(
  fetchTop10MoviesEpic
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
