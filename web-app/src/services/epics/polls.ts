import { Action } from "@reduxjs/toolkit";
import { ActionsObservable, Epic, ofType } from "redux-observable";
import { Observable } from "rxjs";
import { concatMap, switchMap } from "rxjs/operators";
import { IPoll } from "../../shared/interfaces/movie-poll-types";
import PollService from "../poll-service";

enum ActionTypes {
  ADD_POLL = 'polls/addPoll', // reducer
  SET_POLL = 'polls/setPoll', // Epic
  FETCH_POLLS = 'polls/fetchPolls',
  ADD_MOVIE = 'polls/addMovie',
  SET_POLLS = 'polls/setPolls'
}

interface IAddPollAction extends Action {
  type: ActionTypes.ADD_POLL;
  payload: IPoll
}

interface ISetPollAction extends Action {
  type: ActionTypes.SET_POLL,
  payload: IPoll
}

interface IFetchPollsAction extends Action {
  type: ActionTypes.FETCH_POLLS;
}

interface ISetPolls extends Action {
  type: ActionTypes.SET_POLLS,
  payload: IPoll[]
}

interface IAddMovie extends Action {
  type: ActionTypes.ADD_MOVIE,
  payload: {pollId: number, movieId: number}
}

export const setPoll = (poll: IPoll): ISetPollAction => ({
  type: ActionTypes.SET_POLL,
  payload: poll
});

const addPoll = (poll: IPoll): IAddPollAction => ({
  type: ActionTypes.ADD_POLL,
  payload: poll
});

export const fetchPolls = (): IFetchPollsAction => ({
  type: ActionTypes.FETCH_POLLS
});

const setPolls = (polls: IPoll[]): ISetPolls => ({
  type: ActionTypes.SET_POLLS,
  payload: polls
});

export const addMovie = (payload: {pollId: number, movieId: number}): IAddMovie => ({
  type: ActionTypes.ADD_MOVIE,
  payload: payload
}); 

export type PollActionTypes = IFetchPollsAction | 
  IAddPollAction | 
  ISetPollAction | 
  ISetPolls |
  IAddMovie;

// Use switchMap when getting data(read)
// Use either mergeMap or concatMap when posting data(write)
// concatMap vs mergeMap:
// https://www.learnrxjs.io/learn-rxjs/operators/transformation/concatmap

export const setPollEpic: Epic<PollActionTypes> = (
  action$: ActionsObservable<PollActionTypes>
): Observable<PollActionTypes> => action$.pipe(
  ofType<PollActionTypes, ISetPollAction>(ActionTypes.SET_POLL),
  concatMap(async (action: ISetPollAction) => {
    const res = await PollService.createPoll(action.payload);
    return addPoll(res);
  })
);

export const addMovieEpic: Epic<PollActionTypes> = (
  action$: ActionsObservable<PollActionTypes>
): Observable<PollActionTypes> => action$.pipe(
  ofType<PollActionTypes, IAddMovie>(ActionTypes.ADD_MOVIE),
  concatMap(async (action: IAddMovie) => {
    const pollId = action.payload.pollId;
    const movieId = action.payload.movieId;
    const res = await PollService.addMovie(pollId, movieId);
    return addPoll(res);
  })
);

export const fetchPollsEpic: Epic<PollActionTypes> = (
  action$: ActionsObservable<PollActionTypes>
): Observable<PollActionTypes> => action$.pipe(
  ofType<PollActionTypes, IFetchPollsAction>(ActionTypes.FETCH_POLLS),
  switchMap(async (action: IFetchPollsAction) => {
    const polls = await PollService.getPolls();
    return setPolls(polls);
  })
);