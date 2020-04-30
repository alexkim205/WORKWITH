import { authAxios } from '../_config/axiosInstances.config';

const getNotesByProject = projectId =>
  authAxios.get(`/notes/project/${projectId}`).then(res => res.data.notes);

const getNotes = () => authAxios.get('/notes').then(res => res.data.notes);

const getNote = noteId =>
  authAxios.get(`/notes/${noteId}`).then(res => res.data.note);

const createNote = newNote =>
  authAxios.post('/notes/add', newNote).then(res => res.data.note);

const updateNote = (noteId, newNote) =>
  authAxios.put(`/notes/update/${noteId}`, newNote).then(res => res.data.note);

const deleteNote = noteId => authAxios.delete(`/notes/${noteId}`);

export default {
  getNotesByProject,
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
};
