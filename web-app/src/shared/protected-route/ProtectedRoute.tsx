import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { userAuthenticationStatusSelector } from '../../auth/auth-selectors';
import { USER_AUTHENTICATION_STATUS } from '../utils/enums';

const ProtectedRoute: React.FC<any> = ({children, ...rest}) => {
  const userAuthenticationStatus = useSelector(userAuthenticationStatusSelector);

  if (userAuthenticationStatus === USER_AUTHENTICATION_STATUS.NOT_FETCHED) {
    return (
      <Route
        {...rest}
        render={
          ({location}) => <div>Show some kind of loading widget!</div>
        }
      />
    );
  } else if (userAuthenticationStatus === USER_AUTHENTICATION_STATUS.NOT_SIGNED) {
    return (
      <Route 
        {...rest}
        render={
          ({location}) => (
            <Redirect
              to={{
                pathname: '/auth',
                state: {from: location}
              }}
            />
          )
        }
      />
    );
  } else if (userAuthenticationStatus === USER_AUTHENTICATION_STATUS.SIGNED) {
    return (
      <Route
        {...rest}
        render={
          ({location}) => children
        }
      />
    );
  } else {
    return (
      <Route 
        {...rest}
        render={
          ({location}) => (
            <Redirect
              to={{
                pathname: '/auth',
                state: {from: location}
              }}
            />
          )
        }
      />
    );
  }
};

export default ProtectedRoute;