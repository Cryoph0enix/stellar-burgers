import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useSelector, RootState } from '../services/store';
import { Preloader } from '@ui';
import { ISecureRouteOptions } from './type';

export const ProtectedRoute: React.FC<ISecureRouteOptions> = ({
  anonymous = false,
  children
}) => {
  const { isAuthenticated, isInitialized, isFetching } = useSelector(
    (state: RootState) => state.user
  );

  const location = useLocation();
  const redirectTo = location.state?.from || '/';

  if (!isInitialized || isFetching) {
    return <Preloader />;
  }

  if (!anonymous && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (anonymous && isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return children;
};
