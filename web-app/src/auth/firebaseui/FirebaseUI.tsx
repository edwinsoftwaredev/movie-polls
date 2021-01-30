import React, { useEffect } from 'react';
import './FirebaseUI.scss';
import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import {auth as firebaseui} from 'firebaseui';

const FirebaseUI: React.FC = () => {

  useEffect(() => {
		const firebaseConfig = {
      apiKey: "AIzaSyB70N4pe6mTtAHp4C0TDBNUi24mFMRGZEg",
      authDomain: "movie-polls-9d110.firebaseapp.com",
      projectId: "movie-polls-9d110",
      storageBucket: "movie-polls-9d110.appspot.com",
      messagingSenderId: "102319739237",
      appId: "1:102319739237:web:67fdba5c367828d449d18c",
      measurementId: "G-JNJQJKVHEG"
		};

		firebase.initializeApp(firebaseConfig);
		firebase.analytics();

		const ui = new firebaseui.AuthUI(firebase.auth());

		ui.start('#firebaseui-auth-container', {
      signInSuccessUrl: process.env.REACT_APP_REDIRECT_URI,
			signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          window.sessionStorage.setItem('authResult', JSON.stringify(authResult));
          firebase.auth().currentUser?.getIdToken(false).then((idToken) => {
            window.sessionStorage.setItem('idToken', idToken);
          });
          return true;
        }
      }
		});
	}, []);

  return (
    <div id='firebaseui-auth-container'></div>
  )
}

export default FirebaseUI;