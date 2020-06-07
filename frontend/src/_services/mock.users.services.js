import testConstants from '../_constants/test.constants';

const constants = testConstants.users;

const getUsers = async () => constants.users;

const getUser = async () => constants.user;

const getContactsByUser = async () => constants.userWithContacts;

const login = async () => constants.userWithToken;

const register = async () => constants.userWithToken;

const refreshToken = async () => constants.userWithToken;

const updateUser = async () => constants.user;

const deleteUser = async userId =>
  `User with id ${userId} successfully deleted.`;

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
