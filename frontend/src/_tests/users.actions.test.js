import createMockStore from "../_config/mockStore.config";
import usersActions from "../_actions/users.actions";
import testConstants from "../_constants/test.constants";

const {
  users: { user, loginCredentials, newUser, updateUser }
} = testConstants;

describe("User Actions", () => {
  let store;
  beforeAll(() => {
    store = createMockStore();
  });
  afterEach(() => {
    store.clearActions();
  });
  it("it should GET users", async () => {
    await store.dispatch(usersActions.getUsers());
    expect(store.getActions()).toMatchSnapshot();
  });
  it("it should GET a user", async () => {
    await store.dispatch(usersActions.getUser(user._id));
    expect(store.getActions()).toMatchSnapshot();
  });
  it("it should LOGIN a user", async () => {
    await store.dispatch(
      usersActions.login(loginCredentials.email, loginCredentials.password)
    );
    expect(store.getActions()).toMatchSnapshot();
  });
  it("it should REGISTER a user", async () => {
    await store.dispatch(usersActions.register(newUser));
    expect(store.getActions()).toMatchSnapshot();
  });
  it("it should UPDATE a user", async () => {
    await store.dispatch(usersActions.updateUser(user._id, updateUser));
    expect(store.getActions()).toMatchSnapshot();
  });
  it("it should DELETE a note", async () => {
    await store.dispatch(usersActions.deleteUser(user._id));
    expect(store.getActions()).toMatchSnapshot();
  });
});
