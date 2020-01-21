import axios from "axios";
import { getServerUrl } from "../_config/getEnv.config";
import handleError from "../_config/errors/handleAxiosError.util";

const serverUrl = getServerUrl();

const getNotesByProject = projectId =>
  axios
    .get(`${serverUrl}/notes/project/${projectId}`)
    .then(res => res.data)
    .catch(handleError);

const getNotes = () =>
  axios
    .get(`${serverUrl}/notes`)
    .then(res => res.data)
    .catch(handleError);

const getNote = noteId =>
  axios
    .get(`${serverUrl}/notes/${noteId}`)
    .then(res => res.data)
    .catch(handleError);

const createNote = newNote =>
  axios
    .post(`${serverUrl}/notes/add`, newNote)
    .then(res => res.data)
    .catch(handleError);

const updateNote = (noteId, newNote) =>
  axios
    .put(`${serverUrl}/notes/update/${noteId}`, newNote)
    .then(res => res.data)
    .catch(handleError);

const deleteNote = noteId =>
  axios
    .delete(`${serverUrl}/notes/${noteId}`)
    .then(res => res.data)
    .catch(handleError);

export default {
  getNotesByProject,
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
};
