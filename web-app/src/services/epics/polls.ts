import { Action } from "@reduxjs/toolkit";
import { ActionsObservable, Epic, ofType } from "redux-observable";
import { Observable } from "rxjs";
import { concatMap, switchMap } from "rxjs/operators";
import { IPoll, IPoll_PATCH, IRemoveMovie, IVote } from "../../shared/interfaces/movie-poll-types";
import PollService from "../poll-service";

enum ActionTypes {
  ADD_POLL = 'polls/addPoll', // reducer
  SET_POLL = 'polls/setPoll', // Epic
  FETCH_POLLS = 'polls/fetchPolls',
  ADD_MOVIE = 'polls/addMovie',
  SET_POLLS = 'polls/setPolls',
  REMOVE_MOVIE_EPIC = 'polls/removeMovie_epic',
  REMOVE_MOVIE = 'polls/removeMovie',
  REMOVE_POLL_EPIC = 'polls/removePoll_epic',
  REMOVE_POLL = 'polls/removePoll',
  PATCH_POLL = 'polls/patchPoll',
  GET_PUBLIC_POLL = 'polls/getPublicPoll',
  SET_VOTE = 'polls/setVote',
  VOTE = 'polls/vote'
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

interface IRemoveMovieEpic extends Action {
  type: ActionTypes.REMOVE_MOVIE_EPIC;
  payload: IRemoveMovie;
}

interface IRemoveMovieAction extends Action {
  type: ActionTypes.REMOVE_MOVIE;
  payload: IRemoveMovie;
}

interface IRemovePollEpicAction extends Action {
  type: ActionTypes.REMOVE_POLL_EPIC;
  payload: number;
}

interface IRemovePollAction extends Action {
  type: ActionTypes.REMOVE_POLL;
  payload: IPoll;
}

interface IPatchPollAction extends Action {
  type: ActionTypes.PATCH_POLL;
  payload: {id: number, pollPatch: IPoll_PATCH}
}

interface IGetPublicPoll extends Action {
  type: ActionTypes.GET_PUBLIC_POLL,
  payload: {pollId: number, tokenId: string}
}

interface IVoteAction extends Action {
  type: ActionTypes.VOTE;
  payload: {pollId: number, tokenId: string, movieId: number};
}

interface ISetVoteAction extends Action {
  type: ActionTypes.SET_VOTE;
  payload: IVote
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

export const deleteMovie = (payload: IRemoveMovie): IRemoveMovieEpic => ({
  type: ActionTypes.REMOVE_MOVIE_EPIC,
  payload: payload
});

const removeMovie = (payload: IRemoveMovie): IRemoveMovieAction => ({
  type: ActionTypes.REMOVE_MOVIE,
  payload: payload
});

const removePoll = (payload: IPoll): IRemovePollAction => ({
  type: ActionTypes.REMOVE_POLL,
  payload: payload
});

export const deletePoll = (pollId: number): IRemovePollEpicAction => ({
  type: ActionTypes.REMOVE_POLL_EPIC,
  payload: pollId
});

export const patchPoll = (payload: {id: number, pollPatch: IPoll_PATCH}): IPatchPollAction => ({
  type: ActionTypes.PATCH_POLL,
  payload: payload
});

export const getPublicPoll = (payload: {pollId: number, tokenId: string}): IGetPublicPoll => ({
  type: ActionTypes.GET_PUBLIC_POLL,
  payload: payload
});

const setVote = (payload: IVote): ISetVoteAction => ({
  type: ActionTypes.SET_VOTE,
  payload: payload
});

export const vote = (payload: {pollId: number, movieId: number, tokenId: string}): IVoteAction => ({
  type: ActionTypes.VOTE,
  payload: payload
});

export type PollActionTypes = IFetchPollsAction | 
  IAddPollAction | 
  ISetPollAction | 
  ISetPolls |
  IAddMovie |
  IRemoveMovieAction |
  IRemoveMovieEpic |
  IRemovePollAction |
  IRemovePollEpicAction |
  IPatchPollAction |
  IGetPublicPoll |
  ISetVoteAction |
  IVoteAction;

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

export const removeMovieEpic: Epic<PollActionTypes> = (
  action$: ActionsObservable<PollActionTypes>
): Observable<PollActionTypes> => action$.pipe(
  ofType<PollActionTypes, IRemoveMovieEpic>(ActionTypes.REMOVE_MOVIE_EPIC),
  concatMap(async (action: IRemoveMovieEpic) => {
    const res = await PollService.removeMovie(action.payload);
    return removeMovie(res);
  })
);

export const removePollEpic: Epic<PollActionTypes> = (
  action$: ActionsObservable<PollActionTypes>
): Observable<PollActionTypes> => action$.pipe(
  ofType<PollActionTypes, IRemovePollEpicAction>(ActionTypes.REMOVE_POLL_EPIC),
  concatMap(async (action: IRemovePollEpicAction) => {
    const res = await PollService.removePoll(action.payload);
    return removePoll(res);
  })
);

export const patchPollEpic: Epic<PollActionTypes> = (
  action$: ActionsObservable<PollActionTypes>
): Observable<PollActionTypes> => action$.pipe(
  ofType<PollActionTypes, IPatchPollAction>(ActionTypes.PATCH_POLL),
  concatMap(async (action: IPatchPollAction) => {
    const res = await PollService.updatePoll(action.payload.id, action.payload.pollPatch);
    return addPoll(res);
  })
);

export const getPublicPollEpic: Epic<PollActionTypes> = (
  actions$: ActionsObservable<PollActionTypes>
): Observable<PollActionTypes> => actions$.pipe(
  ofType<PollActionTypes, IGetPublicPoll>(ActionTypes.GET_PUBLIC_POLL),
  switchMap(async (action: IGetPublicPoll) => {
    const res = await PollService.getPublicPoll(action.payload.pollId, action.payload.tokenId);
    return addPoll(res);
  })
);

export const setVoteEpic: Epic<PollActionTypes> = (
  action$: ActionsObservable<PollActionTypes>
): Observable<PollActionTypes> => action$.pipe(
  ofType<PollActionTypes, IVoteAction>(ActionTypes.VOTE),
  concatMap(async (action: IVoteAction) => {
    const pollId = action.payload.pollId;
    const movieId = action.payload.movieId;
    const tokenId = action.payload.tokenId;

    const res = await PollService.setVote(pollId, tokenId, movieId);
    return setVote(res);
  })
);