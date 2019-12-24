import axios from "axios";
import to from "await-to-js";
import projectsConstants from "../_constants/projects.constants";
import createActionCreator from "../_utils/createActionCreator.util";
import setupUrls from "../_config/setupUrls";

const { serverUrl } = setupUrls();

const getProjectsByUser = userId => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    "GET_USER_PROJECTS"
  );
  const requestUrl = `${serverUrl}/projects/user/${userId}`;

  dispatch(actionPending());
  const [err, projects] = await to(axios.get(requestUrl));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(projects));
};

const getProjects = () => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    "GET_PROJECTS"
  );
  const requestUrl = `${serverUrl}/projects`;

  dispatch(actionPending());
  const [err, projects] = await to(axios.get(requestUrl));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(projects));
};

const getProject = projectId => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    "GET_PROJECT"
  );
  const requestUrl = `${serverUrl}/projects/${projectId}`;

  dispatch(actionPending());
  const [err, project] = await to(axios.get(requestUrl));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(project));
};

const createProject = newProject => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    "CREATE_PROJECT"
  );
  const requestUrl = `${serverUrl}/projects/add`;

  dispatch(actionPending());
  const [err, project] = await to(axios.post(requestUrl, newProject));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(project));
};

const updateProject = (projectId, newProject) => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    "UPDATE_PROJECT"
  );
  const requestUrl = `${serverUrl}/projects/update/${projectId}`;

  dispatch(actionPending());
  const [err, project] = await to(axios.post(requestUrl, newProject));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(project));
};

const deleteProject = projectId => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    "DELETE_PROJECT"
  );
  const requestUrl = `${serverUrl}/projects/${projectId}`;

  dispatch(actionPending());
  const [err] = await to(axios.delete(requestUrl));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess());
};

export default {
  getProjectsByUser,
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};
