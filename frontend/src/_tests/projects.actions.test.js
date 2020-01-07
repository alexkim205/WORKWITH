import createMockStore from "../_config/mockStore.config";
import projectsActions from "../_actions/projects.actions";
import testConstants from "../_constants/test.constants";

const {
  users: { user },
  projects: { project, newProject, updateProject }
} = testConstants;

describe("Project Actions", () => {
  let store;
  beforeAll(() => {
    store = createMockStore();
  });
  afterEach(() => {
    store.clearActions();
  });
  it("it should GET projects by user", async () => {
    await store.dispatch(projectsActions.getProjectsByUser(user._id));
    expect(store.getActions()).toMatchSnapshot();
  });
  it("it should GET projects", async () => {
    await store.dispatch(projectsActions.getProjects());
    expect(store.getActions()).toMatchSnapshot();
  });
  it("it should GET a project", async () => {
    await store.dispatch(projectsActions.getProject(project._id));
    expect(store.getActions()).toMatchSnapshot();
  });
  it("it should CREATE a project", async () => {
    await store.dispatch(projectsActions.createProject(newProject));
    expect(store.getActions()).toMatchSnapshot();
  });
  it("it should UPDATE a project", async () => {
    await store.dispatch(
      projectsActions.updateProject(project._id, updateProject)
    );
    expect(store.getActions()).toMatchSnapshot();
  });
  it("it should DELETE a project", async () => {
    await store.dispatch(projectsActions.deleteProject(project._id));
    expect(store.getActions()).toMatchSnapshot();
  });
});
