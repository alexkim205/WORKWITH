import createMockStore from '../_config/mockStore.config';
import {
  getUsers,
  getUser,
  login,
  register,
  logout,
  updateUser,
  deleteUser
} from './users.actions';
import testConstants from '../_constants/test.constants';

const {
  users: { user, loginCredentials, newUser, newUpdateUser }
} = testConstants;

describe('User Actions', () => {
  let store;
  beforeAll(() => {
    store = createMockStore();
  });
  afterEach(() => {
    store.clearActions();
  });
  it('it should GET users', async () => {
    await store.dispatch(getUsers());
    expect(store.getActions()).toMatchSnapshot();
  });
  it('it should GET a user', async () => {
    await store.dispatch(getUser(user._id));
    expect(store.getActions()).toMatchSnapshot();
  });
  it('it should LOGIN a user', async () => {
    await store.dispatch(
      login(loginCredentials.email, loginCredentials.password)
    );
    expect(store.getActions()).toMatchSnapshot();
  });
  it('it should REGISTER a user', async () => {
    await store.dispatch(register(newUser));
    expect(store.getActions()).toMatchSnapshot();
  });
  it('it should LOGOUT a user', async () => {
    await store.dispatch(logout());
    expect(store.getActions()).toMatchSnapshot();
  });
  it('it should UPDATE a user', async () => {
    await store.dispatch(updateUser(user._id, newUpdateUser));
    expect(store.getActions()).toMatchSnapshot();
  });
  it('it should DELETE a note', async () => {
    await store.dispatch(deleteUser(user._id));
    expect(store.getActions()).toMatchSnapshot();
  });
});
