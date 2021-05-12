import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { userAuthenticationStatusSelector } from '../auth/auth-selectors';
import { USER_AUTHENTICATION_STATUS } from '../shared/utils/enums';
import {ReactComponent as SearchVector} from '../shared/resources/vectors/search.svg';
import style from './NavBar.module.scss';
import firebase from 'firebase/app';

const NavBarButton: React.FC<any> = ({text, callback, active, children}) => {
  return (
    <div className={style['navbar-button'] + ' ' + (active ? style['active'] : '')}>
      <button onClick={e => callback()}>{children ? children : text}</button>
    </div>
  )
};

const MenuOptions: React.FC<any> = ({userAuthStatus, closeMobileOverlayClbk}) => {
  const history = useHistory();
  const location = useLocation();

  return (
    <Fragment>
      {
        userAuthStatus === USER_AUTHENTICATION_STATUS.SIGNED ? (
          <Fragment>
            <NavBarButton 
              active={location.pathname === '/search'} 
              text={'Search'} 
              callback={() => {closeMobileOverlayClbk(); history.push('/search');}}
            >
              <div className={style['search-vector']}>
                <SearchVector />
              </div>
            </NavBarButton>
            <NavBarButton 
              active={location.pathname === '/'} 
              text='Home' 
              callback={() => {closeMobileOverlayClbk(); history.push('/');}} 
            />
            <NavBarButton 
              active={location.pathname === '/top-movies'} 
              text='Top Movies' 
              callback={() => {closeMobileOverlayClbk(); history.push('/top-movies')}} 
            />
            <NavBarButton 
              active={location.pathname === '/trending-movies'} 
              text='Trending Movies' 
              callback={() => {closeMobileOverlayClbk(); history.push('/trending-movies')}} 
            />
            {/** <NavBarButton text='Random Picks' callback={() => {history.push('/')}} /> */}
            <NavBarButton 
              active={location.pathname === '/my-polls'} 
              text='My Polls' 
              callback={() => {closeMobileOverlayClbk(); history.push('/my-polls')}} 
            />
            <hr style={{height: '1rem', marginTop: 'auto', marginBottom: 'auto'}}/>
            <NavBarButton 
              text='Account' 
              callback={() => {closeMobileOverlayClbk(); history.push('/account')}}
            />
            <NavBarButton 
              text='Sign Out' 
              callback={() => {closeMobileOverlayClbk(); firebase.auth().signOut()}}
            />
          </Fragment>
        ) : null
      }
      {
        userAuthStatus === USER_AUTHENTICATION_STATUS.NOT_SIGNED ? (
          <Fragment>
            <NavBarButton 
              text='About' 
              callback={() => {closeMobileOverlayClbk(); history.push('/about')}} 
            />
            <NavBarButton 
              text='Contact' 
              callback={() => {closeMobileOverlayClbk(); history.push('/contact')}} 
            />
            <hr style={{height: '1rem', marginTop: 'auto', marginBottom: 'auto'}}/>
            <NavBarButton 
              text='Sign In' 
              callback={() => {closeMobileOverlayClbk(); history.push('/auth')}}
            />            
          </Fragment>
        ) : null
      }
    </Fragment>
  )
}

const NavBar: React.FC = () => {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const userAuthStatus = useSelector(userAuthenticationStatusSelector);
  const location = useLocation();
  const history = useHistory();

  const closeMobileOverlay = () => {
    setDrawerOpened(false);
  }

  return (
    (userAuthStatus === USER_AUTHENTICATION_STATUS.SIGNED || 
    userAuthStatus === USER_AUTHENTICATION_STATUS.NOT_SIGNED) &&
    location.pathname !== '/auth' ? (
      <div className={style['navbar-component']}>
        <div className={style['app-title']} onClick={e => history.push('/')}>
          Movie Polls
        </div>
        <div className={style['space']}></div>
        <div className={style['options']}>
          <MenuOptions userAuthStatus={userAuthStatus} closeMobileOverlayClbk={closeMobileOverlay}/>
        </div>
        <div className={style['options-drawer']}>
          <button
            className={
              style['drawer-button'] + ' ' +
              (drawerOpened ? style['open'] : style['close'])
            }
            onClick={e => setDrawerOpened(!drawerOpened)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <div 
          className={
            style['drawer-overlay'] + ' ' +
            (drawerOpened ? style['open'] : style['close'])
          }
          onClick={e => setDrawerOpened(false)}
          onBeforeInputCapture={e => e.stopPropagation()}
        >
        </div>
        <div className={
              style['menu-drawer'] + ' ' +
              (drawerOpened ? style['open'] : style['close'])
            }
            onClick={e => e.stopPropagation()}
        >
          <MenuOptions userAuthStatus={userAuthStatus} closeMobileOverlayClbk={closeMobileOverlay} />
          <div className={style['drawer-space']}></div>
          <div className={style['app-title']}>
            Movie Polls
          </div>
        </div>
      </div>
    ) : null
  )
}

export default NavBar;