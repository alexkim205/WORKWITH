import _ from 'lodash';
import projectsConstants from '../_constants/projects.constants';
import { createReducer, createReducerPart } from '../_utils/createReducer.util';

const initialState = {
  pending: false,
  error: null,
  projects: [],
  project: null
};

const parts = [
  createReducerPart(projectsConstants, 'GET_USER_PROJECTS', 'projects'),
  createReducerPart(projectsConstants, 'GET_PROJECTS', 'projects'),
  createReducerPart(projectsConstants, 'GET_PROJECT', 'project'),
  createReducerPart(projectsConstants, 'CREATE_PROJECT', 'project'),
  createReducerPart(projectsConstants, 'UPDATE_PROJECT', 'project'),
  createReducerPart(projectsConstants, 'DELETE_PROJECT')
];

export default createReducer(initialState, _.assign({}, ...parts));
