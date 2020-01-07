import testConstants from "../_constants/test.constants";

const constants = testConstants.notes;

const getNotesByProject = async () => constants.notes;

const getNotes = async () => constants.notes;

const getNote = async () => constants.note;

const createNote = async () => constants.note;

const updateNote = async () => constants.note;

const deleteNote = async noteId =>
  `Note with id ${noteId} successfully deleted.`;

export default {
  getNotesByProject,
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
};
