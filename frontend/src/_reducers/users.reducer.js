import _ from "lodash";
import userConstants from "../_constants/users.constants";
import { createReducer, createReducerPart } from "../_utils/createReducer.util";

const initialState = {
  pending: false,
  error: null,
  users: [],
  user: null,
  token: null
};

const parts = [
  createReducerPart(userConstants, "GET_USERS_PENDING", "users"),
  createReducerPart(userConstants, "GET_USERS", "users"),
  createReducerPart(userConstants, "GET_USER", "user"),
  createReducerPart(userConstants, "UPDATE_USER", "user"),
  createReducerPart(userConstants, "DELETE_USER"),
  createReducerPart(userConstants, "LOGIN", ["user", "token"]), // user object has token field
  createReducerPart(userConstants, "REGISTER", ["user", "token"]), // user object has token field
  {
    [userConstants.LOGOUT_SUCCESS]: () => ({
      pending: false,
      error: null,
      user: null,
      token: null
    })
  }
];

export default createReducer(initialState, _.assign({}, ...parts));
