import _ from 'lodash';
import projectsConstants from '../_constants/projects.constants';
import { createReducer, createReducerPart } from '../_utils/createReducer.util';

const initialState = {
  projectPending: false,
  projectsPending: false,
  projectError: null,
  projectsError: null,
  projects: [],
  project: null
};

const projectsProps = ['projects', 'projectsPending', 'projectsError'];
const projectProps = ['project', 'projectPending', 'projectError'];

const parts = [
  createReducerPart(projectsConstants, 'GET_USER_PROJECTS', ...projectsProps),
  createReducerPart(projectsConstants, 'GET_PROJECTS', ...projectsProps),
  createReducerPart(projectsConstants, 'GET_PROJECT', ...projectProps),
  createReducerPart(projectsConstants, 'CREATE_PROJECT', ...projectProps),
  createReducerPart(projectsConstants, 'UPDATE_PROJECT', ...projectProps),
  createReducerPart(projectsConstants, 'DELETE_PROJECT', null, 'projectError')
];

export default createReducer(initialState, _.assign({}, ...parts));
