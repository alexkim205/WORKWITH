import to from "await-to-js";
import usersConstants from "../_constants/users.constants";
import services from "../_services";
import createActionCreator from "../_utils/createActionCreator.util";

const { usersServices } = services;

const getUsers = () => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    usersConstants,
    "GET_USERS"
  );

  dispatch(actionPending());
  const [err, users] = await to(usersServices.getUsers());
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(users));
};

const getUser = userId => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    usersConstants,
    "GET_USER"
  );

  dispatch(actionPending());
  const [err, user] = await to(usersServices.getUser(userId));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(user));
};

const login = (email, password) => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    usersConstants,
    "LOGIN"
  );

  dispatch(actionPending());
  const [err, user] = await to(usersServices.login(email, password));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(user));
};

const register = newUser => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    usersConstants,
    "REGISTER"
  );

  dispatch(actionPending());
  const [err, user] = await to(usersServices.register(newUser));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(user));
};

const updateUser = (userId, newUser) => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    usersConstants,
    "UPDATE_USER"
  );

  dispatch(actionPending());
  const [err, user] = await to(usersServices.updateUser(userId, newUser));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(user));
};

const deleteUser = userId => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    usersConstants,
    "DELETE_USER"
  );

  dispatch(actionPending());
  const [err] = await to(usersServices.deleteUser(userId));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess());
};

export default {
  getUsers,
  getUser,
  login,
  register,
  updateUser,
  deleteUser
};
