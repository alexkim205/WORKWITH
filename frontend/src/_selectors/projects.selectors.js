import { createSelector } from 'reselect';

export const getProjectsPendingAndError = createSelector(
  state => state.projects.pending,
  state => state.projects.error,
  (pending, error) => ({
    pending,
    error
  })
);

export const getProjects = state => state.projects.projects;

export const getProject = state => state.projects.project;

export default {
  getProjectsPendingAndError,
  getProjects,
  getProject
};
