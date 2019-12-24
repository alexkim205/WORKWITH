import axios from "axios";
import to from "await-to-js";
import usersConstants from "../_constants/users.constants";
import createActionCreator from "../_utils/createActionCreator.util";
import setupUrls from "../_config/setupUrls";

const { serverUrl } = setupUrls();

const getUsers = () => async dispatch => {
  let [err, users];
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    usersConstants,
    "GET_USERS"
  );
  const requestUrl = `${serverUrl}/users`;

  dispatch(actionPending());
  [err, users] = await to(axios.get(requestUrl));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(users));
};

const getUser = user_id => async dispatch => {
  let [err, user];
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    usersConstants,
    "GET_USER"
  );
  const requestUrl = `${serverUrl}/users/${user_id}`;

  dispatch(actionPending());
  [err, user] = await to(axios.get(requestUrl));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(user));
};

const createUser = newUser => async dispatch => {
  let [err, user];
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    usersConstants,
    "CREATE_USER"
  );
  const requestUrl = `${serverUrl}/users/add`;

  dispatch(actionPending());
  [err, user] = await to(axios.post(requestUrl, newUser));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(user));
};

const updateUser = (user_id, newUser) => async dispatch => {
  let [err, user];
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    usersConstants,
    "UPDATE_USER"
  );
  const requestUrl = `${serverUrl}/users/update/${user_id}`;

  dispatch(actionPending());
  [err, user] = await to(axios.post(requestUrl, newUser));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(user));
};

const deleteUser = user_id => async dispatch => {
  let err;
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    usersConstants,
    "DELETE_USER"
  );
  const requestUrl = `${serverUrl}/users/${user_id}`;

  dispatch(actionPending());
  [err, _] = await to(axios.delete(requestUrl));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess());
};

export const usersActions = {
  getUsersByProject,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};
