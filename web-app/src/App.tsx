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
import TopMovies from './top-movies/TopMovies';
import Interceptors from './auth/security/interceptors';
import TrendingMovies from './trending-movies/TrendingMovies';
import { sliderPropertiesSlice } from './services/slices-selectors/slider-properties';

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
    // this will initialize the default interceptors (CSRF-Token and ID Token)
    Interceptors.setDefaultInterceptors();
    setAuthStateObserver(dispatch);

  }, [dispatch]);

  useEffect(() => {
		const handleResize = () => {
      const sliderWidth = document.body.clientWidth - (document.body.clientWidth/100)*4*2;
			const windowWidth = window.innerWidth;

			if (windowWidth >= 1440) {
			 	const numberCards = 6;
        const cardWidth = (sliderWidth - 4*numberCards) / numberCards;
        dispatch(sliderPropertiesSlice.actions.setSliderProperties({
          cardWidth: cardWidth,
          isMobile: false,
          numberCards: numberCards
        }));
			} else if (windowWidth >= 1360 && windowWidth < 1440) {
				const numberCards = 5;
        const cardWidth = (sliderWidth - 4*numberCards) / numberCards;
        dispatch(sliderPropertiesSlice.actions.setSliderProperties({
          cardWidth: cardWidth,
          isMobile: false,
          numberCards: numberCards
        }));
			} else if (windowWidth >= 769 && windowWidth < 1360) {
				const numberCards = 4;
        const cardWidth = (sliderWidth - 4*numberCards) / numberCards;
        dispatch(sliderPropertiesSlice.actions.setSliderProperties({
          cardWidth: cardWidth,
          isMobile: false,
          numberCards: numberCards
        }));
			} else {
				const numberCards = 0;
        const cardWidth = (sliderWidth - 4*numberCards) / numberCards;
        dispatch(sliderPropertiesSlice.actions.setSliderProperties({
          cardWidth: cardWidth,
          isMobile: true,
          numberCards: numberCards
        }));
			}
		};

    // this should be fixed.
    const timeoutId = setTimeout(() => {
      handleResize();
    }, 1500);

		handleResize();

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
		}
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
          <ProtectedRoute exact path='/top-movies'>
            <TopMovies />
          </ProtectedRoute>
          <ProtectedRoute exact path='/trending-movies'>
            <TrendingMovies />
          </ProtectedRoute>
        </Switch>
      </Router>
    </Fragment>
  );
};

export default App;
