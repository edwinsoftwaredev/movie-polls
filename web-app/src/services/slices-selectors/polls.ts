import { createSelector, createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";
import { IPoll, IRemoveMovie } from "../../shared/interfaces/movie-poll-types";
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
    },
    removeMovie: (state: IPoll[] | null, action: PayloadAction<IRemoveMovie>) => {
      if (state) {
        state = state.map(poll => {
          if (poll.id === action.payload.pollId) {
            poll.movies = 
              poll.movies.filter(movie => movie.movieId !== action.payload.movieId)
          }

          return poll;
        }).filter(poll => poll.movies.length !== 0)
      }

      return state;
    }
  }
});

export const pollsSelector = createSelector(
  (state: RootState) => state.polls,
  (res: IPoll[] | null) => res
);