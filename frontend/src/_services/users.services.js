import axios from "axios";
import { getServerUrl } from "../_config/getEnv.config";
import handleError from "../_config/errors/handleAxiosError.util";

const serverUrl = getServerUrl();

const getUsers = () =>
  axios
    .get(`${serverUrl}/users`)
    .then(res => res.data)
    .catch(handleError);

const getUser = userId =>
  axios
    .get(`${serverUrl}/users/${userId}`)
    .then(res => res.data)
    .catch(handleError);

const login = (email, password) =>
  axios
    .post(`${serverUrl}/users/login`, { email, password })
    .then(res => res.data)
    .catch(handleError);

const register = newUser =>
  axios
    .post(`${serverUrl}/users/add`, newUser)
    .then(res => res.data)
    .catch(handleError);

const updateUser = (userId, newUser) =>
  axios
    .put(`${serverUrl}/users/update/${userId}`, newUser)
    .then(res => res.data)
    .catch(handleError);

const deleteUser = userId =>
  axios
    .delete(`${serverUrl}/users/${userId}`)
    .then(res => res.data)
    .catch(handleError);

export default {
  getUsers,
  getUser,
  login,
  register,
  updateUser,
  deleteUser
};
