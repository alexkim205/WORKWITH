import _ from "lodash";
import userConstants from "../_constants/users.constants";
import { createReducer, createReducerPart } from "../_utils/createReducer.util";

const initialState = {
  pending: false,
  error: null,
  users: [],
  user: null
};

const parts = [
  createReducerPart(userConstants, "GET_USERS_PENDING", "users"),
  createReducerPart(userConstants, "GET_USERS", "users"),
  createReducerPart(userConstants, "GET_USER", "user"),
  createReducerPart(userConstants, "UPDATE_USER", "user"),
  createReducerPart(userConstants, "DELETE_USER"),
  createReducerPart(userConstants, "LOGIN", "user"), // user object has token field
  createReducerPart(userConstants, "REGISTER", "user"), // user object has token field
  {
    LOGOUT_SUCCESS: () => ({
      pending: false,
      error: null,
      user: null
    })
  }
];

export default createReducer(initialState, _.assign({}, ...parts));
