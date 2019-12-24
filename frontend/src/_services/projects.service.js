import axios from "axios";
import to from "await-to-js";
import projectsConstants from "../_constants/projects.constants";
import createActionCreator from "../_utils/createActionCreator.util";
import setupUrls from "../_config/setupUrls";

const { serverUrl } = setupUrls();

const getProjectsByUser = user_id => async dispatch => {
  let [err, projects];
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    "GET_USER_PROJECTS"
  );
  const requestUrl = `${serverUrl}/projects/user/${user_id}`;

  dispatch(actionPending());
  [err, projects] = await to(axios.get(requestUrl));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(projects));
};

const getProjects = () => async dispatch => {
  let [err, projects];
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    "GET_PROJECTS"
  );
  const requestUrl = `${serverUrl}/projects`;

  dispatch(actionPending());
  [err, projects] = await to(axios.get(requestUrl));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(projects));
};

const getProject = project_id => async dispatch => {
  let [err, project];
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    "GET_PROJECT"
  );
  const requestUrl = `${serverUrl}/projects/${project_id}`;

  dispatch(actionPending());
  [err, project] = await to(axios.get(requestUrl));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(project));
};

const createProject = newProject => async dispatch => {
  let [err, project];
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    "CREATE_PROJECT"
  );
  const requestUrl = `${serverUrl}/projects/add`;

  dispatch(actionPending());
  [err, project] = await to(axios.post(requestUrl, newProject));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(project));
};

const updateProject = (project_id, newProject) => async dispatch => {
  let [err, project];
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    "UPDATE_PROJECT"
  );
  const requestUrl = `${serverUrl}/projects/update/${project_id}`;

  dispatch(actionPending());
  [err, project] = await to(axios.post(requestUrl, newProject));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(project));
};

const deleteProject = project_id => async dispatch => {
  let err;
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    "DELETE_PROJECT"
  );
  const requestUrl = `${serverUrl}/projects/${project_id}`;

  dispatch(actionPending());
  [err, _] = await to(axios.delete(requestUrl));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess());
};

export const projectsActions = {
  getProjectsByUser,
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};
