import { authAxios } from '../_config/axiosInstances.config';

const getNotesByProject = (projectId, axiosOptions) =>
  authAxios
    .get(`/notes/project/${projectId}`, axiosOptions)
    .then(res => res.data.notes);

const getNotes = axiosOptions =>
  authAxios.get('/notes', axiosOptions).then(res => res.data.notes);

const getNote = (noteId, axiosOptions) =>
  authAxios.get(`/notes/${noteId}`, axiosOptions).then(res => res.data.note);

const createNote = (newNote, axiosOptions) =>
  authAxios
    .post('/notes/add', newNote, axiosOptions)
    .then(res => res.data.note);

const updateNote = (noteId, newNote, axiosOptions) =>
  authAxios
    .put(`/notes/update/${noteId}`, newNote, axiosOptions)
    .then(res => res.data.note);

const deleteNote = (noteId, axiosOptions) =>
  authAxios.delete(`/notes/${noteId}`, axiosOptions);

export default {
  getNotesByProject,
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
};
