/* eslint-disable no-param-reassign */
import jwt from 'jsonwebtoken';
import ServerError from './errors/Server.error';
import HttpStatus from '../_constants/httpErrors.constants';
import { refreshToken as refreshTokenAction } from '../_actions/users.actions';
import { authAxios, baseAxios } from './axiosInstances.config';

const handleError = error => {
  // https://github.com/axios/axios/issues/383
  if (!error.response) {
    // network error
    throw new ServerError(HttpStatus.NETWORK_CONNECT_TIMEOUT);
  }
  throw new ServerError(error.response.status);
};

export default store => {
  // Error Response Interceptor
  baseAxios.interceptors.response.use(response => response, handleError);
  authAxios.interceptors.response.use(response => response, handleError);

  // Error Request Interceptor
  authAxios.interceptors.request.use(
    async config => {
      const { user, token, refreshToken } = store.getState().users;

      if (!token) {
        return Promise.reject(Error('Invalid or missing token.'));
      }

      let authToken = token;

      // If token exists, then user hasn't logged out yet.
      if (jwt.decode(token).exp < Date.now() / 1000) {
        // Auth token expired, use refresh token to refresh
        await store.dispatch(refreshTokenAction({ user, refreshToken }));
        const { token: newToken, error } = store.getState().users;

        if (error) {
          return Promise.reject(error);
        }
        authToken = newToken;
      }

      // Use either unexpired token or refreshed token
      config.headers.Authorization = `Bearer ${authToken}`;
      return config;
    },
    error => {
      Promise.reject(error);
    }
  );
};
