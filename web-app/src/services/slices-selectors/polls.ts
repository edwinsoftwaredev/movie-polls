import { createSelector, createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";
import { IPoll } from "../../shared/interfaces/movie-poll-types";
import { RootState } from "../../store/store";

// The value null represents the -> intentional <- absence of any object value.
const initialState: IPoll[] | null = null; 

export const pollsSlice = createSlice<IPoll[] | null, SliceCaseReducers<IPoll[] | null>>({
  name: 'polls',
  initialState: initialState,
  reducers: {
    addPoll: (state: IPoll[] | null, action: PayloadAction<IPoll>) => {
      if (state?.find(poll => action.payload.id === poll.id)) {
        state = state?.map(poll => {
          // By doing this the items will have the same
          // position or index in the array
          if (poll.id === action.payload.id)
            return action.payload;

          return poll;
        });
      } else {
        if (!state) {
          state = [action.payload]
        } else {
          state = [action.payload, ...state];
        }
      }
      return state;
    },
    setPolls: (state: IPoll[] | null, action: PayloadAction<IPoll[]>) => {
      state = action.payload;
      return state;
    }
  }
});

export const pollsSelector = createSelector(
  (state: RootState) => state.polls,
  (res: IPoll[] | null) => res
);