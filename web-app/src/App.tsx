import React, { Fragment, useEffect } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
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
import NavBar from './navbar/NavBar';
import Footer from './footer/Footer';


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
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    setAuthStateObserver(dispatch);
  }, [dispatch]);

  return (
    <Fragment>
      <Router>
        <NavBar />
        <Switch>
          <Route exact path='/'>
            <InitialPage />
          </Route>
          <Route exact path='/auth'>
            <Auth />
          </Route>
          <ProtectedRoute path='/account'>
            <Account />
          </ProtectedRoute>
        </Switch>
      </Router>
    </Fragment>
  );
};

export default App;
