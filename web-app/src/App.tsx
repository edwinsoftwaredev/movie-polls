import React, { useEffect } from 'react';
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
import style from './App.module.scss';
import ScrollToTop from './shared/utils/scroll-to-top/ScrollToTop';
import { fetchPolls } from './services/epics/polls';
import Search from './search/Search';
import Footer from './footer/Footer';
import MyPolls from './my-polls/MyPolls';
import Poll from './poll/Poll';

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
  const userAuthenticationStatus = useSelector(userAuthenticationStatusSelector);

  useEffect(() => {
    // this will initialize the default interceptors (CSRF-Token and ID Token)
    Interceptors.setDefaultInterceptors();
    setAuthStateObserver(dispatch);

  }, [dispatch]);

  useEffect(() => {
    if (userAuthenticationStatus === USER_AUTHENTICATION_STATUS.SIGNED) {
      // fetch all polls
      dispatch(fetchPolls());
    }
  }, [userAuthenticationStatus, dispatch]);

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

    /**
     * this will observe and execute a callback when a resize event is detected
     * on an element even when the event is not triggered by the user.
     */
    const resizeObserver = new ResizeObserver(() => {
      // Unexpected behaviour happens when the card overlay is open.
      // Therefore the existence of that overlay is checked to determine if
      // handleResize function has to be executed.
      const el = document.getElementById('card-overlay-portal');
      if (el && window.location.pathname !== '/search') return;
      handleResize();
    });

    resizeObserver.observe(document.body);

		return () => {
      resizeObserver.disconnect();
		}
	}, [dispatch]);

  return (
    <div className={style['app-component']}>
      <Router>
        <ScrollToTop />
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
          <ProtectedRoute path='/search'>
            <Search />
          </ProtectedRoute>
          <ProtectedRoute exact path='/my-polls'>
            <MyPolls />
          </ProtectedRoute>
          <ProtectedRoute path='/poll'>
            <Poll />
          </ProtectedRoute>
        </Switch>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
