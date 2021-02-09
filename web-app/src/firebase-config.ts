import { Dispatch } from '@reduxjs/toolkit';
import firebase from 'firebase/app';
import authSlice from './auth/auth-slice';
import { USER_AUTHENTICATION_STATUS } from './shared/utils/enums';

export const initializeFirebase = () => {  
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "movie-polls-9d110.firebaseapp.com",
    projectId: "movie-polls-9d110",
    storageBucket: "movie-polls-9d110.appspot.com",
    messagingSenderId: "102319739237",
    appId: "1:102319739237:web:67fdba5c367828d449d18c",
    measurementId: "G-JNJQJKVHEG"
  };
  
  firebase.initializeApp(firebaseConfig);
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  firebase.analytics();
};

export const setAuthStateObserver = (dispatch: Dispatch<any>) => {
  const action = authSlice.actions.setUserAuthenticationStatus;

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      dispatch(action(USER_AUTHENTICATION_STATUS.SIGNED))
    } else {
      dispatch(action(USER_AUTHENTICATION_STATUS.NOT_SIGNED))
    }
  }, error => dispatch(action(USER_AUTHENTICATION_STATUS.ERROR_RETRIVING)))
};