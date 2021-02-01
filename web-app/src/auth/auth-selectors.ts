import { createSelector } from "@reduxjs/toolkit";
import { USER_AUTHENTICATION_STATUS } from "../shared/utils/enums";
import { RootState } from "../store/store";

export const userAuthenticationStatusSelector = createSelector(
  (state: RootState) => state.auth.userAuthenticationStatus,
  (status: USER_AUTHENTICATION_STATUS) => status
);