import axios from "axios";
import to from "await-to-js";
import usersConstants from "../_constants/users.constants";
import createActionCreator from "../_utils/createActionCreator.util";
import setupUrls from "../_config/setupUrls";

const { serverUrl } = setupUrls();

const getUsers = () => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    usersConstants,
    "GET_USERS"
  );
  const requestUrl = `${serverUrl}/users`;

  dispatch(actionPending());
  const [err, users] = await to(axios.get(requestUrl));
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
  const requestUrl = `${serverUrl}/users/${userId}`;

  dispatch(actionPending());
  const [err, user] = await to(axios.get(requestUrl));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(user));
};

const createUser = newUser => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    usersConstants,
    "CREATE_USER"
  );
  const requestUrl = `${serverUrl}/users/add`;

  dispatch(actionPending());
  const [err, user] = await to(axios.post(requestUrl, newUser));
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
  const requestUrl = `${serverUrl}/users/update/${userId}`;

  dispatch(actionPending());
  const [err, user] = await to(axios.post(requestUrl, newUser));
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
  const requestUrl = `${serverUrl}/users/${userId}`;

  dispatch(actionPending());
  const [err] = await to(axios.delete(requestUrl));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess());
};

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};
