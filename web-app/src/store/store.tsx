import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "../auth/auth-slice";

const rootReducer = combineReducers({
  auth: authSlice.reducer
});

const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default store;
