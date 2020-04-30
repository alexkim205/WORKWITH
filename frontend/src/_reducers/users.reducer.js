import _ from 'lodash';
import userConstants from '../_constants/users.constants';
import { createReducer, createReducerPart } from '../_utils/createReducer.util';

const initialState = {
  pending: false,
  error: null,
  users: [],
  user: null,
  token: null,
  refreshToken: null
};

const parts = [
  createReducerPart(userConstants, 'GET_USERS_PENDING', 'users'),
  createReducerPart(userConstants, 'GET_USERS', 'users'),
  createReducerPart(userConstants, 'GET_USER', 'user'),
  createReducerPart(userConstants, 'UPDATE_USER', 'user'),
  createReducerPart(userConstants, 'DELETE_USER'),
  createReducerPart(userConstants, 'LOGIN', ['user', 'token', 'refreshToken']),
  createReducerPart(userConstants, 'REGISTER', [
    'user',
    'token',
    'refreshToken'
  ]),
  createReducerPart(userConstants, 'REFRESH_TOKEN', [
    'user',
    'token',
    'refreshToken'
  ]),
  {
    [userConstants.LOGOUT_SUCCESS]: () => ({
      pending: false,
      error: null,
      user: null,
      token: null,
      refreshToken: null
    })
  }
];

export default createReducer(initialState, _.assign({}, ...parts));
