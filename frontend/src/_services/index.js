import { switchEnvs } from '../_config/getEnv.config';

import usersServices from './users.services';
import mockUsersServices from './mock.users.services';
import notesServices from './notes.services';
import mockNotesServices from './mock.notes.services';
import projectsServices from './projects.services';
import mockProjectsServices from './mock.projects.services';

export default {
  usersServices: switchEnvs({
    generic: usersServices,
    test: mockUsersServices,
    testConnection: mockUsersServices
  }),
  notesServices: switchEnvs({
    generic: notesServices,
    test: mockNotesServices,
    testConnection: mockNotesServices
  }),
  projectsServices: switchEnvs({
    generic: projectsServices,
    test: mockProjectsServices,
    testConnection: mockProjectsServices
  })
};
