import { Action } from "@reduxjs/toolkit";
import { Epic, ofType } from "redux-observable";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { IMovie } from "../../shared/interfaces/movie-types";
import MovieService from "../movie-service";

enum Actions {
  SET_SEARCH_RESULT = 'searchResult/setMovies',
  FETCH_SEARCH_RESULT = 'searchResult/fetchMovies'
}

interface ISetMovieAction extends Action {
  type: Actions.SET_SEARCH_RESULT,
  payload: IMovie[]
}

interface IFetchSearchResultAction extends Action {
  type: Actions.FETCH_SEARCH_RESULT,
  payload: string
}

const setMovies = (movies: IMovie[]): ISetMovieAction => ({
  type: Actions.SET_SEARCH_RESULT,
  payload: movies
});

export const fetchSearchResult = (q: string): IFetchSearchResultAction => ({
  type: Actions.FETCH_SEARCH_RESULT,
  payload: q
});

export type SearchMoviesActions = ISetMovieAction | IFetchSearchResultAction;

export const fetchSearchResultEpic: Epic<SearchMoviesActions> = (
  action$: Observable<SearchMoviesActions>
): Observable<SearchMoviesActions> => action$.pipe(
  ofType<SearchMoviesActions, IFetchSearchResultAction>(Actions.FETCH_SEARCH_RESULT),
  switchMap(async (action: IFetchSearchResultAction) => {
    const res = await MovieService.searchMovie(action.payload);
    return setMovies(res);
  }) 
);