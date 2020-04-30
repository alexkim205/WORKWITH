import createMockStore from '../_config/mockStore.config';
import {
  getProjectsByUser,
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} from '../_actions/projects.actions';
import testConstants from '../_constants/test.constants';

const {
  users: { user },
  projects: { project, newProject, newUpdateProject }
} = testConstants;

describe('Project Actions', () => {
  let store;
  beforeAll(() => {
    store = createMockStore();
  });
  afterEach(() => {
    store.clearActions();
  });
  it('it should GET projects by user', async () => {
    await store.dispatch(getProjectsByUser(user._id));
    expect(store.getActions()).toMatchSnapshot();
  });
  it('it should GET projects', async () => {
    await store.dispatch(getProjects());
    expect(store.getActions()).toMatchSnapshot();
  });
  it('it should GET a project', async () => {
    await store.dispatch(getProject(project._id));
    expect(store.getActions()).toMatchSnapshot();
  });
  it('it should CREATE a project', async () => {
    await store.dispatch(createProject(newProject));
    expect(store.getActions()).toMatchSnapshot();
  });
  it('it should UPDATE a project', async () => {
    await store.dispatch(updateProject(project._id, newUpdateProject));
    expect(store.getActions()).toMatchSnapshot();
  });
  it('it should DELETE a project', async () => {
    await store.dispatch(deleteProject(project._id));
    expect(store.getActions()).toMatchSnapshot();
  });
});
