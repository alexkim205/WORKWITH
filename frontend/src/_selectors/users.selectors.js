import { createSelector } from "reselect";

export const getCurrentUserAndToken = createSelector(
  state => state.users.user,
  state => state.users.token,
  (user, token) => ({
    user,
    token
  })
);

export const getUsersPendingAndError = createSelector(
  state => state.users.pending,
  state => state.users.error,
  (pending, error) => ({
    pending,
    error
  })
);

export const getUsers = state => state.users.users;

export default {
  getCurrentUserAndToken,
  getUsersPendingAndError,
  getUsers
};
