import axios from "axios";
import to from "await-to-js";
import notesConstants from "../_constants/notes.constants";
import createActionCreator from "../_utils/createActionCreator.util";
import setupUrls from "../_config/setupUrls";

const { serverUrl } = serverUrls();

const getNotesByProject = project_id => async dispatch => {
  let [err, notes];
  const { actionPending, actionSuccess, actionError } = createActionCreator(
    developersConstants,
    "GET_NOTES"
  );
  const requestUrl = `${serverUrl}/notes/project/${project_id}`;

  dispatch(actionPending());
  [err, notes] = await to(axios.get(requestUrl));
  if (err) {
    dispatch(actionError(err));
    throw err;
  }
};

const getNote = note_id => {};

const createNote = note => {};

const updateNote = (note_id, note) => {};

const deleteNote = note => {};

export const notesActions = {
  getNotesByProject,
  getNote,
  createNote,
  updateNote,
  deleteNote
};
