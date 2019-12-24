import axios from "axios";
import to from "await-to-js";
import projectsConstants from "../_constants/projects.constants";
import createActionCreator from "../_utils/createActionCreator.util";
import setupUrls from "../_config/setupUrls";

const { serverUrl } = setupUrls();

const getProjectsByUser = user_id => async dispatch => {
  let [err, projects];
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    notesConstants,
    "GET_USER_PROJECTS"
  );
  const requestUrl = `${serverUrl}/projects/user/${project_id}`;

  dispatch(actionPending());
  [err, notes] = await to(axios.get(requestUrl));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(notes));
};

const getNotes = () => async dispatch => {
  let [err, notes];
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    notesConstants,
    "GET_NOTES"
  );
  const requestUrl = `${serverUrl}/notes`;

  dispatch(actionPending());
  [err, notes] = await to(axios.get(requestUrl));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(notes));
};

const getNote = note_id => async dispatch => {
  let [err, note];
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    notesConstants,
    "GET_NOTE"
  );
  const requestUrl = `${serverUrl}/notes/${note_id}`;

  dispatch(actionPending());
  [err, note] = await to(axios.get(requestUrl));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(note));
};

const createNote = newNote => async dispatch => {
  let [err, note];
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    notesConstants,
    "CREATE_NOTE"
  );
  const requestUrl = `${serverUrl}/notes/add`;

  dispatch(actionPending());
  [err, note] = await to(axios.post(requestUrl, newNote));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(note));
};

const updateNote = (note_id, newNote) => async dispatch => {
  let [err, note];
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    notesConstants,
    "UPDATE_NOTE"
  );
  const requestUrl = `${serverUrl}/notes/update/${note_id}`;

  dispatch(actionPending());
  [err, note] = await to(axios.post(requestUrl, newNote));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess(note));
};

const deleteNote = note_id => async dispatch => {
  let err;
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    notesConstants,
    "DELETE_NOTE"
  );
  const requestUrl = `${serverUrl}/notes/${note_id}`;

  dispatch(actionPending());
  [err, _] = await to(axios.delete(requestUrl));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
  dispatch(actionSuccess());
};

export const notesActions = {
  getNotesByProject,
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
};
