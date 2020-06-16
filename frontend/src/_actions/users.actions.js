import to from 'await-to-js';
import usersConstants from '../_constants/users.constants';
import services from '../_services';
import createActionCreator from '../_utils/createActionCreator.util';
import history from '../_config/history.config';

const { usersServices } = services;

export const getUsers = axiosOptions => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    usersConstants,
    'GET_USERS'
  );

  dispatch(actionPending());
  const [err, users] = await to(usersServices.getUsers(axiosOptions));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(users));
};

export const getUser = (userId, axiosOptions) => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    usersConstants,
    'GET_USER'
  );

  dispatch(actionPending());
  const [err, user] = await to(usersServices.getUser(userId, axiosOptions));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(user));
};

export const getContactsByUser = (userId, axiosOptions) => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    usersConstants,
    'GET_CONTACTS_BY_USER'
  );

  dispatch(actionPending());
  const [err, user] = await to(
    usersServices.getContactsByUser(userId, axiosOptions)
  );
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(user));
};

export const login = (email, password, axiosOptions) => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    usersConstants,
    'LOGIN'
  );

  dispatch(actionPending());
  const [err, user] = await to(
    usersServices.login(email, password, axiosOptions)
  );
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(user));
  history.push('/projects');
};

export const logout = () => async dispatch => {
  dispatch({ type: usersConstants.LOGOUT_SUCCESS });
};

export const register = (newUser, axiosOptions) => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    usersConstants,
    'REGISTER'
  );

  dispatch(actionPending());
  const [err, user] = await to(usersServices.register(newUser, axiosOptions));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(user));
  history.push('/projects');
};

export const refreshToken = (userWithToken, axiosOptions) => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    usersConstants,
    'REFRESH_TOKEN'
  );

  dispatch(actionPending());
  const [err, user] = await to(
    usersServices.refreshToken(userWithToken, axiosOptions)
  );
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(user));
};

export const updateUser = (userId, newUser, axiosOptions) => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    usersConstants,
    'UPDATE_USER'
  );

  dispatch(actionPending());
  const [err, user] = await to(
    usersServices.updateUser(userId, newUser, axiosOptions)
  );
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(user));
};

export const deleteUser = (userId, axiosOptions) => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    usersConstants,
    'DELETE_USER'
  );

  dispatch(actionPending());
  const [err] = await to(usersServices.deleteUser(userId, axiosOptions));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess());
};

export default {
  getUsers,
  getUser,
  getContactsByUser,
  login,
  register,
  logout,
  updateUser,
  deleteUser
};
