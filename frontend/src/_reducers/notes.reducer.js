import _ from "lodash";
import notesConstants from "../_constants/notes.constants";
import { createReducer, createReducerPart } from "../_utils/createReducer.util";

const initialState = {
  pending: false,
  error: null,
  notes: [],
  note: null
};

const parts = [
  createReducerPart(notesConstants, "GET_PROJECT_NOTES", "notes"),
  createReducerPart(notesConstants, "GET_NOTES", "notes"),
  createReducerPart(notesConstants, "GET_NOTE", "note"),
  createReducerPart(notesConstants, "CREATE_NOTE", "note"),
  createReducerPart(notesConstants, "UPDATE_NOTE", "note"),
  createReducerPart(notesConstants, "DELETE_NOTE")
];

export default createReducer(initialState, _.assign({}, ...parts));
