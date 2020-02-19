/* eslint-disable no-param-reassign */
import axios from "axios";
import ServerError from "./errors/Server.error";
import HttpStatus from "../_constants/httpErrors.constants";

export default store => {
  // Request interceptor
  axios.interceptors.request.use(
    config => {
      const { token } = store.getState().users;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      Promise.reject(error);
    }
  );

  // Request interceptor
  axios.interceptors.response.use(
    response => response,
    error => {
      // https://github.com/axios/axios/issues/383
      if (!error.response) {
        // network error
        throw new ServerError(HttpStatus.NETWORK_CONNECT_TIMEOUT);
      }
      throw new ServerError(error.response.status);
    }
  );
};
