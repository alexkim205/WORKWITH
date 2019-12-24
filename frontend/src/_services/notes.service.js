import axios from "axios";
import to from "await-to-js";
import notesConstants from "../_constants/notes.constants";
import createActionCreator from "../_utils/createActionCreator.util";
import setupUrls from "../_config/setupUrls";

const { serverUrl } = setupUrls();

const getNotesByProject = projectId => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    notesConstants,
    "GET_PROJECT_NOTES"
  );
  const requestUrl = `${serverUrl}/notes/project/${projectId}`;

  dispatch(actionPending());
  const [err, notes] = await to(axios.get(requestUrl));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(notes));
};

const getNotes = () => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    notesConstants,
    "GET_NOTES"
  );
  const requestUrl = `${serverUrl}/notes`;

  dispatch(actionPending());
  const [err, notes] = await to(axios.get(requestUrl));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(notes));
};

const getNote = noteId => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    notesConstants,
    "GET_NOTE"
  );
  const requestUrl = `${serverUrl}/notes/${noteId}`;

  dispatch(actionPending());
  const [err, note] = await to(axios.get(requestUrl));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(note));
};

const createNote = newNote => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    notesConstants,
    "CREATE_NOTE"
  );
  const requestUrl = `${serverUrl}/notes/add`;

  dispatch(actionPending());
  const [err, note] = await to(axios.post(requestUrl, newNote));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(note));
};

const updateNote = (noteId, newNote) => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    notesConstants,
    "UPDATE_NOTE"
  );
  const requestUrl = `${serverUrl}/notes/update/${noteId}`;

  dispatch(actionPending());
  const [err, note] = await to(axios.post(requestUrl, newNote));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(note));
};

const deleteNote = noteId => async dispatch => {
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    notesConstants,
    "DELETE_NOTE"
  );
  const requestUrl = `${serverUrl}/notes/${noteId}`;

  dispatch(actionPending());
  const [err] = await to(axios.delete(requestUrl));
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
