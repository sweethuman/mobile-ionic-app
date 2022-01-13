import React, {useContext} from 'react';
import {Redirect, Route, RouteProps} from 'react-router-dom';
import {AuthContext, AuthState} from './AuthProvider';
import {getLogger} from '../core';

const log = getLogger('Login');


export const PrivateRoute: React.FC<RouteProps> = ({component: Component, ...rest}) => {
  const {isAuthenticated} = useContext<AuthState>(AuthContext);
  log('render, isAuthenticated', isAuthenticated);
  return (
    <Route {...rest} render={props => {
      if (isAuthenticated) {
        // @ts-ignore
        return <Component {...props} />;
      }
      return <Redirect to={{pathname: '/login'}}/>
    }}/>
  );
}
