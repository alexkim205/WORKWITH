import axios from "axios";
import { getServerUrl } from "../_config/getEnv.config";

const serverUrl = getServerUrl();

const getProjectsByUser = userId =>
  axios
    .get(`${serverUrl}/projects/user/${userId}`)
    .then(res => res.data.projects);

const getProjects = () =>
  axios.get(`${serverUrl}/projects`).then(res => res.data.projects);

const getProject = projectId =>
  axios.get(`${serverUrl}/projects/${projectId}`).then(res => res.data.project);

const createProject = newProject =>
  axios
    .post(`${serverUrl}/projects/add`, newProject)
    .then(res => res.data.project);

const updateProject = (projectId, newProject) =>
  axios
    .put(`${serverUrl}/projects/update/${projectId}`, newProject)
    .then(res => res.data.project);

const deleteProject = projectId =>
  axios.delete(`${serverUrl}/projects/${projectId}`);

export default {
  getProjectsByUser,
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};
