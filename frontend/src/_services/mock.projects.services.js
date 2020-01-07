import testConstants from "../_constants/test.constants";

const constants = testConstants.projects;

const getProjectsByUser = async () => constants.projects;

const getProjects = async () => constants.projects;

const getProject = async () => constants.project;

const createProject = async () => constants.project;

const updateProject = async () => constants.project;

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
