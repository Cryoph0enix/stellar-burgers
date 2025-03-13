import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUser } from '../../slices/user-auth-slice';
import { useLocation } from 'react-router-dom';

export const AppHeader: FC = () => {
  const userName = useSelector(getUser)?.name;
  const currentRoute = useLocation();
  return <AppHeaderUI userName={userName} currentRoute={currentRoute} />;
};
