import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { IAuthStatus } from '@utils-types';
import { deleteCookie, setCookie } from '../utils/cookie';
import { RootState } from '../services/store';

// Функция для установки токенов
const setTokens = (userData: any) => {
  if (userData.success) {
    setCookie('accessToken', userData.accessToken);
    localStorage.setItem('refreshToken', userData.refreshToken);
  }
};

// Функция для удаления токенов
const removeTokens = () => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

// Функция для обработки ошибок
const handleError = (state: IAuthStatus, action: any) => {
  state.isFetching = false;
  state.errorMessage = action.error?.message ?? 'Unknown error';
};

// Функция для сброса состояния при pending
const resetStateOnPending = (state: IAuthStatus) => {
  state.isAuthenticated = false;
  state.isFetching = true;
  state.errorMessage = null;
};

// Функция для сброса состояния при fulfilled
const resetStateOnFulfilled = (state: IAuthStatus, payload: any) => {
  state.isFetching = false;
  state.isInitialized = true;
  state.errorMessage = null;
  state.currentUser = payload.currentUser;
  state.isAuthenticated = true;
};

export const loginAsync = createAsyncThunk(
  'users/loginUser',
  async (userData: TLoginData) => {
    const res = await loginUserApi(userData);
    setTokens(res);
    return res;
  }
);

export const registerAsync = createAsyncThunk(
  'users/registerUser',
  async (userData: TRegisterData) => {
    const res = await registerUserApi(userData);
    setTokens(res);
    return res;
  }
);

export const forgotPasswordAsync = createAsyncThunk(
  'users/forgotPassword',
  forgotPasswordApi
);

export const resetPasswordAsync = createAsyncThunk(
  'users/resetPassword',
  resetPasswordApi
);

export const fetchUserAsync = createAsyncThunk('user/getUser', getUserApi);

export const updateUserAsync = createAsyncThunk(
  'user/updateUser',
  updateUserApi
);

export const logoutAsync = createAsyncThunk('user/logoutUser', async () => {
  const res = await logoutApi();
  if (res.success) {
    removeTokens();
  }
  return res;
});

export const initialState: IAuthStatus = {
  isInitialized: false,
  isFetching: false,
  currentUser: null,
  errorMessage: null,
  isAuthenticated: false
};

export const userAuthSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    init: (state) => {
      state.isInitialized = true;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginAsync.pending, resetStateOnPending);
    builder.addCase(registerAsync.pending, resetStateOnPending);
    builder.addCase(fetchUserAsync.pending, resetStateOnPending);

    builder.addCase(loginAsync.rejected, (state, action) => {
      handleError(state, action);
    });
    builder.addCase(registerAsync.rejected, (state, action) => {
      handleError(state, action);
      state.isInitialized = true;
    });
    builder.addCase(fetchUserAsync.rejected, (state, action) => {
      handleError(state, action);
      state.isInitialized = true;
    });
    builder.addCase(logoutAsync.rejected, (state, action) => {
      state.errorMessage = action.error?.message ?? 'Unknown error';
    });
    builder.addCase(forgotPasswordAsync.rejected, (state, action) => {
      state.errorMessage = action.error?.message ?? 'Unknown error';
    });
    builder.addCase(resetPasswordAsync.rejected, (state, action) => {
      state.errorMessage = action.error?.message ?? 'Unknown error';
    });

    builder.addCase(loginAsync.fulfilled, resetStateOnFulfilled);
    builder.addCase(registerAsync.fulfilled, resetStateOnFulfilled);
    builder.addCase(fetchUserAsync.fulfilled, resetStateOnFulfilled);

    builder.addCase(updateUserAsync.fulfilled, (state, { payload }) => {
      state.currentUser = payload.user;
      state.errorMessage = null;
    });

    builder.addCase(logoutAsync.fulfilled, (state) => {
      state.currentUser = null;
      state.errorMessage = null;
      state.isAuthenticated = false;
    });

    builder.addCase(forgotPasswordAsync.pending, (state) => {
      state.errorMessage = null;
    });
    builder.addCase(resetPasswordAsync.pending, (state) => {
      state.errorMessage = null;
    });
    builder.addCase(forgotPasswordAsync.fulfilled, (state) => {
      state.errorMessage = null;
    });
    builder.addCase(resetPasswordAsync.fulfilled, (state) => {
      state.errorMessage = null;
    });
  }
});

export const { init } = userAuthSlice.actions;
export const getUser = (state: RootState) => state.user.currentUser;
export const getUserError = (state: RootState) => state.user.errorMessage;
export const isUserLoading = (state: RootState) => state.user.isFetching;
export const isLoggedIn = (state: RootState) => state.user.isAuthenticated;
export default userAuthSlice.reducer;
