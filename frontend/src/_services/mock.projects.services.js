import testConstants from '../_constants/test.constants';

const constants = testConstants.projects;

const getProjectsByUser = async () => constants.projects.projects;

const getProjects = async () => constants.projects.projects;

const getProject = async () => constants.project.project;

const createProject = async () => constants.project.project;

const updateProject = async () => constants.project.project;

const deleteProject = async projectId =>
  `Project with id ${projectId} successfully deleted.`;

export default {
  getProjectsByUser,
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};
