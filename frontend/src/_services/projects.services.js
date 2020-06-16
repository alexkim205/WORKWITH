import { authAxios } from '../_config/axiosInstances.config';
import { handleProjectError } from '../_config/errors/Project.error';

const getProjectsByUser = (userId, axiosOptions) =>
  authAxios
    .get(`/projects/user/${userId}`, axiosOptions)
    .then(res => res.data.projects);

const getProjects = axiosOptions =>
  authAxios.get('/projects', axiosOptions).then(res => res.data.projects);

const getProject = (projectId, axiosOptions) =>
  authAxios
    .get(`/projects/${projectId}`, axiosOptions)
    .then(res => res.data.project);

const createProject = (newProject, axiosOptions) =>
  authAxios
    .post('/projects/add', newProject, axiosOptions)
    .then(res => res.data.project)
    .catch(handleProjectError);

const updateProject = (projectId, newProject, axiosOptions) =>
  authAxios
    .put(`/projects/update/${projectId}`, newProject, axiosOptions)
    .then(res => res.data.project);

const deleteProject = (projectId, axiosOptions) =>
  authAxios.delete(`/projects/${projectId}`, axiosOptions);

export default {
  getProjectsByUser,
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};
