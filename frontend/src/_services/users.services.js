import { baseAxios, authAxios } from '../_config/axiosInstances.config';
import { handleRegisterError } from '../_config/errors/Register.error';
import { handleLoginError } from '../_config/errors/Login.error';

const getUsers = axiosOptions =>
  authAxios.get('/users', axiosOptions).then(res => res.data.users);

const getUser = (userId, axiosOptions) =>
  authAxios.get(`/users/${userId}`, axiosOptions).then(res => res.data.user);

const getContactsByUser = (userId, axiosOptions) =>
  authAxios
    .get(`/users/${userId}/contacts`, axiosOptions)
    .then(res => res.data.user);

const login = (email, password, axiosOptions) =>
  baseAxios
    .post('/users/login', { email, password }, axiosOptions)
    .then(res => res.data)
    .catch(handleLoginError);

const register = (newUser, axiosOptions) =>
  baseAxios
    .post('/users/add', newUser, axiosOptions)
    .then(res => res.data)
    .catch(handleRegisterError);

const refreshToken = (userWithToken, axiosOptions) =>
  baseAxios
    .post('/users/token', userWithToken, axiosOptions)
    .then(res => res.data);

const updateUser = (userId, newUser, axiosOptions) =>
  authAxios
    .put(`/users/update/${userId}`, newUser, axiosOptions)
    .then(res => res.data.user);

const deleteUser = (userId, axiosOptions) =>
  authAxios.delete(`/users/${userId}`, axiosOptions).then(res => res.data);

export default {
  getUsers,
  getUser,
  getContactsByUser,
  login,
  register,
  refreshToken,
  updateUser,
  deleteUser
};
