import { createSelector } from 'reselect';

export const getProjectsPendingAndError = createSelector(
  state => state.projects.projectsPending,
  state => state.projects.projectsError,
  (pending, error) => ({
    pending,
    error
  })
);

export const getProjectPendingAndError = createSelector(
  state => state.projects.projectPending,
  state => state.projects.projectError,
  (pending, error) => ({
    pending,
    error
  })
);

export const getProjects = state => state.projects.projects;

export const getProject = state => state.projects.project;

export default {
  getProjectsPendingAndError,
  getProjectPendingAndError,
  getProjects,
  getProject
};
