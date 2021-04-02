import { Action } from "@reduxjs/toolkit";
import { ActionsObservable, Epic, ofType } from "redux-observable";
import { Observable } from "rxjs";
import { concatMap } from "rxjs/operators";
import { IPoll } from "../../shared/interfaces/movie-poll-types";
import PollService from "../poll-service";

enum ActionTypes {
  ADD_POLL = 'polls/addPoll', // EPIC
  SET_POLL = 'polls/setPoll', // Reducer
  FETCH_POLLS = 'polls/fetchPolls'
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
  type: ActionTypes.FETCH_POLLS
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

export type PollActionTypes = IFetchPollsAction | IAddPollAction | ISetPollAction;

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