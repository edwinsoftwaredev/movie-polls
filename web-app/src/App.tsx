import React, { useEffect } from 'react';
import logo from './logo.svg';
import style from './App.module.scss';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Auth from './auth/Auth';
import LandingPage from './landing-page/LandingPage';
import Home from './home/Home';
import LoadingPage from './loading-page/LoadingPage';
import Account from './account/Account';
import ProtectedRoute from './shared/protected-route/ProtectedRoute';
import { useDispatch, useSelector } from 'react-redux';
import { USER_AUTHENTICATION_STATUS } from './shared/utils/enums';
import { userAuthenticationStatusSelector } from './auth/auth-selectors';
import { setAuthStateObserver } from './firebase-config';


const InitialPage: React.FC = () => {
  const userAuthenticationStatus = useSelector(userAuthenticationStatusSelector);

  if (userAuthenticationStatus === USER_AUTHENTICATION_STATUS.NOT_FETCHED) {
    return <LoadingPage />;
  } else if (userAuthenticationStatus === USER_AUTHENTICATION_STATUS.NOT_SIGNED) {
    return <LandingPage />;
  } else if (userAuthenticationStatus === USER_AUTHENTICATION_STATUS.SIGNED) {
    return <Home />;
  } else {
    return <LandingPage />;
  }
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    setAuthStateObserver(dispatch);
  }, [dispatch]);

  return (
    <Router>
      <Route exact path='/'>
        <InitialPage />
      </Route>
      <Route path='/auth'>
        <Auth />
      </Route>
      <ProtectedRoute path='/account'>
        <Account />
      </ProtectedRoute>
    </Router>
  );
}

export default App;
