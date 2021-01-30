import React, { useEffect } from 'react';
import './FirebaseUI.scss';
import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import {auth as firebaseui} from 'firebaseui';

const FirebaseUI: React.FC = () => {

  useEffect(() => {
		const firebaseConfig = {
			apiKey: "AIzaSyDE433rN99xE-xv5x3atmyEy8GS5xbKwYk",
			authDomain: "movie-polls-e2e1d.firebaseapp.com",
			projectId: "movie-polls-e2e1d",
			storageBucket: "movie-polls-e2e1d.appspot.com",
			messagingSenderId: "901456091743",
			appId: "1:901456091743:web:64da991f98cedbf56cd9ea",
			measurementId: "G-CYHNJ28M1C"	
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