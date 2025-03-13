import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { getUserError, isUserLoading } from '../../slices/user-auth-slice';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const loadingState = useSelector(isUserLoading);
  const errorMessage = useSelector(getUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    forgotPasswordApi({ email })
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch((err) => setError(err));
  };

  return loadingState ? (
    <Preloader />
  ) : (
    <ForgotPasswordUI
      errorText={errorMessage}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
