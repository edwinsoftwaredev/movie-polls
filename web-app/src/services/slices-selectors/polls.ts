import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPoll } from "../../shared/interfaces/movie-poll-types";
import { RootState } from "../../store/store";

const initialState: IPoll[] = [];

export const pollsSlice = createSlice({
  name: 'polls',
  initialState: initialState,
  reducers: {
    addPoll: (state: IPoll[], action: PayloadAction<IPoll>) => {
      state = [...state, action.payload];
      return state;
    }
  }
});

export const pollsSelector = createSelector(
  (state: RootState) => state.polls,
  (res: IPoll[]) => res
);