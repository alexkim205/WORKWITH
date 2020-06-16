import to from 'await-to-js';
import notesConstants from '../_constants/notes.constants';
import services from '../_services';
import createActionCreator from '../_utils/createActionCreator.util';

const { notesServices } = services;

export const getNotesByProject = (
  projectId,
  axiosOptions
) => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    notesConstants,
    'GET_PROJECT_NOTES'
  );

  dispatch(actionPending());
  const [err, notes] = await to(
    notesServices.getNotesByProject(projectId, axiosOptions)
  );
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(notes));
};

export const getNotes = axiosOptions => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    notesConstants,
    'GET_NOTES'
  );

  dispatch(actionPending());
  const [err, notes] = await to(notesServices.getNotes(axiosOptions));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(notes));
};

export const getNote = (noteId, axiosOptions) => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    notesConstants,
    'GET_NOTE'
  );

  dispatch(actionPending());
  const [err, note] = await to(notesServices.getNote(noteId, axiosOptions));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(note));
};

export const createNote = (newNote, axiosOptions) => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    notesConstants,
    'CREATE_NOTE'
  );

  dispatch(actionPending());
  const [err, note] = await to(notesServices.createNote(newNote, axiosOptions));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(note));
};

export const updateNote = (noteId, newNote, axiosOptions) => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    notesConstants,
    'UPDATE_NOTE'
  );

  dispatch(actionPending());
  const [err, note] = await to(
    notesServices.updateNote(noteId, newNote, axiosOptions)
  );
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(note));
};

export const deleteNote = (noteId, axiosOptions) => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    notesConstants,
    'DELETE_NOTE'
  );

  dispatch(actionPending());
  const [err] = await to(notesServices.deleteNote(noteId, axiosOptions));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess());
};

export default {
  getNotesByProject,
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
};
