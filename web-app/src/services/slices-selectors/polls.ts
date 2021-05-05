import { createSelector, createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";
import { IPoll, IRemoveMovie, IToken, IVote } from "../../shared/interfaces/movie-poll-types";
import { RootState } from "../../store/store";

// The value null represents the -> intentional <- absence of any object value.
const initialState: IPoll[] | null = null; 

// Notes about how to update or modify the state in a reducer
// or how to copy objects o update them.
export const pollsSlice = createSlice<IPoll[] | null, SliceCaseReducers<IPoll[] | null>>({
  name: 'polls',
  initialState: initialState,
  reducers: {
    addPoll: (state: IPoll[] | null, action: PayloadAction<IPoll>) => {
      if (state?.find(poll => action.payload.id === poll.id)) {
        state = state?.map(poll => {
          // By doing this the items will have the same
          // position or index in the array
          if (poll.id === action.payload.id) {
            const isOpenPatch = action.payload.isOpen !== poll.isOpen;
            return {
              ...poll, 
              ...action.payload,
              movies: isOpenPatch ? poll.movies.map(movie => ({...movie, voteCount: 0})) : poll.movies,
              tokens: isOpenPatch ? [] : poll.tokens,
              tokenQty: isOpenPatch ? 0 : poll.tokenQty
            };
          }

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
        // if an inner object in the state must be changed
        // create a variable like the follow:
        state = state.map(poll => {
          if (poll.id === action.payload.pollId) {
            // DO NOT do things like:
            //
            // poll.movie = something;
            //
            // That will MUTATE the object.
            // To avoid mutate the state create a NEW Poll object.
            //
            // DO NOT use the spread operator when none of the properties are not changed, like:
            // {...object} <-- It doesn't change any property, therefore a shallowed copy is
            // returned, which means that a memory address is COPIED and NOT created.
            // {...object} == object <-- True: same memory address/same object.
            //
            // To change the state a NEW object has to be assigned to it.
            // By doing that IMMUTABILITY is preserve.
            // AVOID MUTABILITY.

            // The following code CREATES a NEW object using the spread operator
            // (the property "movies" is setted).

            poll = {
              ...poll, 
              movies: poll.movies.filter(movie => movie.movieId !== action.payload.movieId)
            };
          }

          return poll;
        }).filter(poll => poll.movies.length !== 0);
      }

      return state;
    },
    removePoll: (state: IPoll[] | null, action: PayloadAction<IPoll>) => {
      if (!state)
        return state;

      state = state.filter(poll => poll.id !== action.payload.id);
      return state;
    },
    addToken: (state: IPoll[] | null, action: PayloadAction<IToken>) => {
      if (!state)
        return state;

      state = state.map(poll => {
        if (poll.id === action.payload.pollId) {
          return {
            ...poll, 
            tokens: (
              poll.tokens && 
              poll.tokens.length !== 0 ? 
              [action.payload, ...poll.tokens] : [action.payload]
            )
          };
        }
        
        return poll;
      });

      return state;
    },
    removeToken: (state: IPoll[] | null, action: PayloadAction<IToken>) => {
      if (!state)
        return state;

      state = state.map(poll => {
        if (poll.id === action.payload.pollId) {
          return {
            ...poll,
            tokens: poll.tokens?.filter(token => token.uuid !== action.payload.uuid)          
          };
        }

        return poll;
      });

      return state;
    },
    setVote: (state: IPoll[] | null, action: PayloadAction<IVote>) => {
      if (!state)
        return state;

      const token = action.payload.token;
      const movie = action.payload.movie;

      state = state.map(poll => {
        if (poll.id === token.pollId && poll.id === movie.pollId) {
          return {
            ...poll,
            tokens: poll.tokens?.map(t => {
              if (t.uuid === token.uuid) {
                return {
                  ...t,
                  used: token.used
                };
              }

              return t;
            }),
            movies: poll.movies.map(m => {
              if (m.movieId === movie.movieId) {
                return {
                  ...m,
                  voteCount: movie.voteCount
                };
              }

              return m;
            })
          };
        }

        return poll;
      });

      return state;
    }
  }
});

export const pollsSelector = createSelector(
  (state: RootState) => state.polls,
  (res: IPoll[] | null) => res
);