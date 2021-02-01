import React, { useEffect } from 'react';
import './FirebaseUI.scss';
import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import {auth as firebaseui} from 'firebaseui';

const elementId = '#firebaseui-auth-container';
const uiConfig = {
  signInSuccessUrl: process.env.REACT_APP_REDIRECT_URI,
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ]
};

const FirebaseUI: React.FC = () => {
  useEffect(() => {    
    const uiInstance = firebaseui.AuthUI.getInstance();

    if (uiInstance) {
      uiInstance.reset();
      uiInstance.start(elementId, uiConfig);
    } else {
      const ui = new firebaseui.AuthUI(firebase.auth());
      ui.start(elementId, uiConfig);
    }
	}, []);

  return (
    <div id='firebaseui-auth-container'></div>
  )
}

export default FirebaseUI;