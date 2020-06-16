import _ from 'lodash';
import projectsConstants from '../_constants/projects.constants';
import { createReducer, createReducerPart } from '../_utils/createReducer.util';

// Because get and create project happens on the same page,
// we must different these states.
const initialState = {
  projectPending: false,
  projectsPending: false,
  createProjectPending: false,
  projectError: null,
  projectsError: null,
  createProjectError: null,
  projects: [],
  project: null,
  createdProject: null
};

const projectsProps = ['projects', 'projectsPending', 'projectsError'];
const projectProps = ['project', 'projectPending', 'projectError'];
const createProjectProps = [
  'createdProject',
  'createProjectPending',
  'createProjectError'
];

const parts = [
  createReducerPart(projectsConstants, 'GET_USER_PROJECTS', ...projectsProps),
  createReducerPart(projectsConstants, 'GET_PROJECTS', ...projectsProps),
  createReducerPart(projectsConstants, 'GET_PROJECT', ...projectProps),
  createReducerPart(projectsConstants, 'CREATE_PROJECT', ...createProjectProps),
  createReducerPart(projectsConstants, 'UPDATE_PROJECT', ...projectProps),
  createReducerPart(projectsConstants, 'DELETE_PROJECT', null, 'projectError')
];

export default createReducer(initialState, _.assign({}, ...parts));
