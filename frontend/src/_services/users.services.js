import { baseAxios, authAxios } from '../_config/axiosInstances.config';
import { handleRegisterError } from '../_config/errors/Register.error';
import { handleLoginError } from '../_config/errors/Login.error';

const getUsers = () => authAxios.get('/users').then(res => res.data.users);

const getUser = userId =>
  authAxios.get(`/users/${userId}`).then(res => res.data.user);

const getContactsByUser = userId =>
  authAxios.get(`/users/${userId}/contacts`).then(res => res.data.user);

const login = (email, password) =>
  baseAxios
    .post('/users/login', { email, password })
    .then(res => res.data)
    .catch(handleLoginError);

const register = newUser =>
  baseAxios
    .post('/users/add', newUser)
    .then(res => res.data)
    .catch(handleRegisterError);

const refreshToken = userWithToken =>
  baseAxios.post('/users/token', userWithToken).then(res => res.data);

const updateUser = (userId, newUser) =>
  authAxios.put(`/users/update/${userId}`, newUser).then(res => res.data.user);

const deleteUser = userId =>
  authAxios.delete(`/users/${userId}`).then(res => res.data);

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
