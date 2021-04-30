import { Action } from "@reduxjs/toolkit";
import { ActionsObservable, Epic, ofType } from "redux-observable";
import { Observable } from "rxjs";
import { concatMap } from "rxjs/operators";
import { IToken } from "../../shared/interfaces/movie-poll-types";
import TokenService from "../token-service";

enum Actions {
  ADD_TOKEN = 'polls/addToken',
  ADD_TOKEN_EPIC = 'polls/addTokenEpic',
  REMOVE_TOKEN = 'polls/removeToken',
  REMOVE_TOKEN_EPIC = 'polls/removeTokenEpic'
}

interface IAddToken extends Action {
  type: Actions.ADD_TOKEN;
  payload: IToken;
}

interface IAddTokenEpic extends Action {
  type: Actions.ADD_TOKEN_EPIC;
  payload: {pollId: number};
}

interface IRemoveToken extends Action {
  type: Actions.REMOVE_TOKEN;
  payload: IToken;
}

interface IRemoveTokenEpic extends Action {
  type: Actions.REMOVE_TOKEN_EPIC;
  payload: {pollId: number, tokenId: string};
}

const addTokenAction = (token: IToken): IAddToken => ({
  type: Actions.ADD_TOKEN,
  payload: token
});

export const addToken = (payload: {pollId: number}): IAddTokenEpic => ({
  type: Actions.ADD_TOKEN_EPIC,
  payload: payload
});

const removeTokenAction = (token: IToken): IRemoveToken => ({
  type: Actions.REMOVE_TOKEN,
  payload: token
});

export const removeToken = (payload: {pollId: number, tokenId: string}): IRemoveTokenEpic => ({
  type: Actions.REMOVE_TOKEN_EPIC,
  payload: payload
});

export type TokenActionsTypes = IAddToken | IAddTokenEpic | IRemoveToken | IRemoveTokenEpic;

export const addTokenEpic: Epic<TokenActionsTypes> = (
  action$: ActionsObservable<TokenActionsTypes>
): Observable<TokenActionsTypes> => action$.pipe(
  ofType<TokenActionsTypes, IAddTokenEpic>(Actions.ADD_TOKEN_EPIC),
  concatMap(async (action: IAddTokenEpic) => {
    const token = await TokenService.createToken(action.payload.pollId);
    return addTokenAction(token);
  })
);

export const removeTokenEpic: Epic<TokenActionsTypes> = (
  actions$: ActionsObservable<TokenActionsTypes>
): Observable<TokenActionsTypes> => actions$.pipe(
  ofType<TokenActionsTypes, IRemoveTokenEpic>(Actions.REMOVE_TOKEN_EPIC),
  concatMap(async (action: IRemoveTokenEpic) => {
    const token = await TokenService.removeToken(action.payload.pollId, action.payload.tokenId);
    return removeTokenAction(token);
  })
);