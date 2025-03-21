import { configureStore } from '@reduxjs/toolkit';
import userAuthReducer, {
  fetchUserAsync,
  loginAsync,
  logoutAsync,
  registerAsync
} from './user-auth-slice';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';
import { TAuthResponse } from '@api';

jest.mock('@api', () => ({
  ...jest.requireActual('@api'),
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  getUserApi: jest.fn(),
  logoutApi: jest.fn()
}));

const mockAuthResponse: TAuthResponse = {
  success: true,
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  user: {
    email: 'Boomshak@yandex.ru',
    name: 'Zz123456'
  }
};

const mockAuthCredentials = {
  email: 'Boomshak@yandex.ru',
  password: 'Zz123456'
};

const mockRegDetails = {
  email: 'Boomshak@yandex.ru',
  name: 'Roman',
  password: 'Zz123456'
};

const mockErrorMessage = {
  success: false,
  message: 'ошибка'
};

beforeEach(() => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
  jest.clearAllMocks();
});

describe('test user-auth-slice', () => {
  it('checking for a successful request loginAsync', (done) => {
    const mockLoginUser = jest
      .spyOn(require('@api'), 'loginUserApi')
      .mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockAuthResponse), 5);
          })
      );

    const store = configureStore({
      reducer: {
        user: userAuthReducer
      }
    });

    const initialState = store.getState().user;
    expect(initialState.isFetching).toBe(false);

    store.dispatch(loginAsync(mockAuthCredentials));

    store.subscribe(() => {
      const finalState = store.getState().user;
      if (!finalState.isFetching) {
        expect(finalState.isAuthenticated).toBe(true);
        expect(localStorage.getItem('refreshToken')).toEqual('refresh-token');
        expect(getCookie('accessToken')).toEqual('access-token');
        expect(finalState.user).toEqual(mockAuthResponse.user);
        done();
      }
    });
  });

  it('checking for a failed request loginAsync', (done) => {
    const mockGetOrders = jest
      .spyOn(require('@api'), 'loginUserApi')
      .mockImplementation(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(mockErrorMessage), 5);
          })
      );

    const store = configureStore({
      reducer: {
        user: userAuthReducer
      }
    });

    const initialState = store.getState().user;
    expect(initialState.isFetching).toBe(false);

    store.dispatch(loginAsync(mockAuthCredentials));

    store.subscribe(() => {
      const finalState = store.getState().user;
      if (!finalState.isFetching) {
        expect(finalState.errorMessage).toBe('ошибка');
        done();
      }
    });
  });

  it('checking for a successful request registerAsync', (done) => {
    const mockLoginUser = jest
      .spyOn(require('@api'), 'registerUserApi')
      .mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockAuthResponse), 5);
          })
      );

    const store = configureStore({
      reducer: {
        user: userAuthReducer
      }
    });

    const initialState = store.getState().user;
    expect(initialState.isFetching).toBe(false);

    store.dispatch(registerAsync(mockRegDetails));

    store.subscribe(() => {
      const finalState = store.getState().user;
      if (!finalState.isFetching) {
        expect(finalState.isAuthenticated).toBe(true);
        expect(finalState.user).toEqual(mockAuthResponse.user);
        done();
      }
    });
  });

  it('checking for a failed request registerAsync', (done) => {
    const mockGetOrders = jest
      .spyOn(require('@api'), 'registerUserApi')
      .mockImplementation(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(mockErrorMessage), 5);
          })
      );

    const store = configureStore({
      reducer: {
        user: userAuthReducer
      }
    });

    const initialState = store.getState().user;
    expect(initialState.isFetching).toBe(false);

    store.dispatch(registerAsync(mockRegDetails));

    store.subscribe(() => {
      const finalState = store.getState().user;
      if (!finalState.isFetching) {
        expect(finalState.errorMessage).toBe('ошибка');
        done();
      }
    });
  });

  it('checking for a successful request fetchUserAsync', (done) => {
    const mockLoginUser = jest
      .spyOn(require('@api'), 'getUserApi')
      .mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockAuthResponse), 5);
          })
      );

    const store = configureStore({
      reducer: {
        user: userAuthReducer
      }
    });

    const initialState = store.getState().user;
    expect(initialState.isFetching).toBe(false);

    store.dispatch(fetchUserAsync());

    store.subscribe(() => {
      const finalState = store.getState().user;
      if (!finalState.isFetching) {
        expect(finalState.isAuthenticated).toBe(true);
        expect(finalState.user).toEqual(mockAuthResponse.user);
        done();
      }
    });
  });

  it('checking for a failed request fetchUserAsync', (done) => {
    const mockGetOrders = jest
      .spyOn(require('@api'), 'getUserApi')
      .mockImplementation(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(mockErrorMessage), 5);
          })
      );

    const store = configureStore({
      reducer: {
        user: userAuthReducer
      }
    });

    const initialState = store.getState().user;
    expect(initialState.isFetching).toBe(false);

    store.dispatch(fetchUserAsync());

    store.subscribe(() => {
      const finalState = store.getState().user;
      if (!finalState.isFetching) {
        expect(finalState.errorMessage).toBe('ошибка');
        done();
      }
    });
  });

  it('checking for a successful request logoutAsync', (done) => {
    localStorage.setItem('refreshToken', 'refresh-token');
    setCookie('accessToken', 'access-token');
    const mockLogoutUser = jest
      .spyOn(require('@api'), 'logoutApi')
      .mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ success: true }), 5);
          })
      );

    const store = configureStore({
      reducer: {
        user: userAuthReducer
      }
    });

    const initialState = store.getState().user;
    expect(initialState.isFetching).toBe(false);

    store.dispatch(logoutAsync());

    store.subscribe(() => {
      const finalState = store.getState().user;
      if (!finalState.isFetching) {
        expect(finalState.isAuthenticated).toBe(false);
        expect(localStorage.getItem('refreshToken')).toBe(null);
        expect(getCookie('accessToken')).toBe(undefined);
        expect(finalState.user).toEqual(null);
        done();
      }
    });
  });
});
