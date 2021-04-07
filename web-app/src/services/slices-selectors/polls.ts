import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPoll } from "../../shared/interfaces/movie-poll-types";
import { RootState } from "../../store/store";

const initialState: IPoll[] = [];

export const pollsSlice = createSlice({
  name: 'polls',
  initialState: initialState,
  reducers: {
    addPoll: (state: IPoll[], action: PayloadAction<IPoll>) => {
      state = [...state.map(poll => {
        // By doing this the items will have the same
        // position or index in the array
        if (poll.id === action.payload.id) 
          return action.payload;

        return poll;
      })];

      return state;
    },
    setOpenedPolls: (state: IPoll[], action: PayloadAction<IPoll[]>) => {
      state = [...state.filter(poll => !poll.isOpen), ...action.payload];
      return state;
    },
    setNotOpenedPolls: (state: IPoll[], action: PayloadAction<IPoll[]>) => {
      state = [...state.filter(poll => poll.isOpen), ...action.payload];
    }
  }
});

export const pollsSelector = createSelector(
  (state: RootState) => state.polls,
  (res: IPoll[]) => res
);