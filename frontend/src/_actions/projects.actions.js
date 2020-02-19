import to from "await-to-js";
import projectsConstants from "../_constants/projects.constants";
import services from "../_services";
import createActionCreator from "../_utils/createActionCreator.util";

const { projectsServices } = services;

export const getProjectsByUser = userId => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    "GET_USER_PROJECTS"
  );

  dispatch(actionPending());
  const [err, projects] = await to(projectsServices.getProjectsByUser(userId));
  if (err) {
    dispatch(actionError(err));
    return;
  }
  dispatch(actionSuccess(projects));
};

export const getProjects = () => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    "GET_PROJECTS"
  );

  dispatch(actionPending());
  const [err, projects] = await to(projectsServices.getProjects());
  if (err) {
    dispatch(actionError(err));
    return;
  }
  dispatch(actionSuccess(projects));
};

export const getProject = projectId => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    "GET_PROJECT"
  );

  dispatch(actionPending());
  const [err, project] = await to(projectsServices.getProject(projectId));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(project));
};

export const createProject = newProject => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    "CREATE_PROJECT"
  );

  dispatch(actionPending());
  const [err, project] = await to(projectsServices.createProject(newProject));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(project));
};

export const updateProject = (projectId, newProject) => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    "UPDATE_PROJECT"
  );

  dispatch(actionPending());
  const [err, project] = await to(
    projectsServices.updateProject(projectId, newProject)
  );
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(project));
};

export const deleteProject = projectId => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    "DELETE_PROJECT"
  );

  dispatch(actionPending());
  const [err] = await to(projectsServices.deleteProject(projectId));
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
