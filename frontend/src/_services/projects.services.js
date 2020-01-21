import axios from "axios";
import { getServerUrl } from "../_config/getEnv.config";
import handleError from "../_config/errors/handleAxiosError.util";

const serverUrl = getServerUrl();

const getProjectsByUser = userId =>
  axios
    .get(`${serverUrl}/projects/user/${userId}`)
    .then(res => res.data)
    .catch(handleError);

const getProjects = () =>
  axios
    .get(`${serverUrl}/projects`)
    .then(res => res.data)
    .catch(handleError);

const getProject = projectId =>
  axios
    .get(`${serverUrl}/projects/${projectId}`)
    .then(res => res.data)
    .catch(handleError);

const createProject = newProject =>
  axios
    .post(`${serverUrl}/projects/add`, newProject)
    .then(res => res.data)
    .catch(handleError);

const updateProject = (projectId, newProject) =>
  axios
    .put(`${serverUrl}/projects/update/${projectId}`, newProject)
    .then(res => res.data)
    .catch(handleError);

const deleteProject = projectId =>
  axios
    .delete(`${serverUrl}/projects/${projectId}`)
    .then(res => res.data)
    .catch(handleError);

export default {
  getProjectsByUser,
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};
