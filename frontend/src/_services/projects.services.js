import { authAxios } from '../_config/axiosInstances.config';
import { handleProjectError } from '../_config/errors/Project.error';

const getProjectsByUser = userId =>
  authAxios.get(`/projects/user/${userId}`).then(res => res.data.projects);

const getProjects = () =>
  authAxios.get('/projects').then(res => res.data.projects);

const getProject = projectId =>
  authAxios.get(`/projects/${projectId}`).then(res => res.data.project);

const createProject = newProject =>
  authAxios
    .post('/projects/add', newProject)
    .then(res => res.data.project)
    .catch(handleProjectError);

const updateProject = (projectId, newProject) =>
  authAxios
    .put(`/projects/update/${projectId}`, newProject)
    .then(res => res.data.project);

const deleteProject = projectId => authAxios.delete(`/projects/${projectId}`);

export default {
  getProjectsByUser,
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};
