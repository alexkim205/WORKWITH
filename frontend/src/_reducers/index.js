import { combineReducers } from 'redux';
import usersReducer from './users.reducer';
import notesReducer from './notes.reducer';
import projectsReducer from './projects.reducer';

export default combineReducers({
  users: usersReducer,
  notes: notesReducer,
  projects: projectsReducer
});
