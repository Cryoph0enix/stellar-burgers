import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useSelector, RootState } from '../services/store';
import { Preloader } from '@ui';
import { ISecureRouteOptions } from './type';

export const ProtectedRoute: React.FC<ISecureRouteOptions> = ({
  unknown = false,
  children
}) => {
  const { isAuthenticated, isInitialized, isFetching } = useSelector(
    (state: RootState) => state.user
  );

  const location = useLocation();
  const redirectTo = location.state?.from || '/';

  if (!isInitialized || isFetching) return <Preloader />;
  if (unknown && isAuthenticated) return <Navigate to={redirectTo} replace />;
  if (!isAuthenticated)
    return <Navigate to='/login' state={{ from: location }} replace />;

  return children;
};
