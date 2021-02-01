import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { USER_AUTHENTICATION_STATUS } from "../shared/utils/enums";

export interface AuthState {
  userAuthenticationStatus: USER_AUTHENTICATION_STATUS
};

const initialState: AuthState = {
  userAuthenticationStatus: USER_AUTHENTICATION_STATUS.NOT_FETCHED
};

const setUserAuthenticationStatus = (
  state: AuthState,
  action: PayloadAction<USER_AUTHENTICATION_STATUS>
) => {
  state.userAuthenticationStatus = action.payload;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setUserAuthenticationStatus
  }
});

export default authSlice;