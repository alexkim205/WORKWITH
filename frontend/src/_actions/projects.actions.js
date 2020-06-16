import to from 'await-to-js';
import projectsConstants from '../_constants/projects.constants';
import services from '../_services';
import createActionCreator from '../_utils/createActionCreator.util';

const { projectsServices } = services;

export const getProjectsByUser = (userId, axiosOptions) => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    'GET_USER_PROJECTS'
  );

  dispatch(actionPending());
  const [err, projects] = await to(
    projectsServices.getProjectsByUser(userId, axiosOptions)
  );
  if (err) {
    dispatch(actionError(err));
    return;
  }
  dispatch(actionSuccess(projects));
};

export const getProjects = axiosOptions => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    'GET_PROJECTS'
  );

  dispatch(actionPending());
  const [err, projects] = await to(projectsServices.getProjects(axiosOptions));
  if (err) {
    dispatch(actionError(err));
    return;
  }
  dispatch(actionSuccess(projects));
};

export const getProject = (projectId, axiosOptions) => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    'GET_PROJECT'
  );

  dispatch(actionPending());
  const [err, project] = await to(
    projectsServices.getProject(projectId, axiosOptions)
  );
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(project));
};

export const createProject = (newProject, axiosOptions) => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    'CREATE_PROJECT'
  );

  dispatch(actionPending());
  const [err, project] = await to(
    projectsServices.createProject(newProject, axiosOptions)
  );
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(project));
};

export const updateProject = (
  projectId,
  newProject,
  axiosOptions
) => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    'UPDATE_PROJECT'
  );

  dispatch(actionPending());
  const [err, project] = await to(
    projectsServices.updateProject(projectId, newProject, axiosOptions)
  );
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(project));
};

export const deleteProject = (projectId, axiosOptions) => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    projectsConstants,
    'DELETE_PROJECT'
  );

  dispatch(actionPending());
  const [err] = await to(
    projectsServices.deleteProject(projectId, axiosOptions)
  );
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
