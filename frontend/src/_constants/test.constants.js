import _ from 'lodash';

const notes = {
  notes: [
    {
      authors: ['5e02eeaf6ebf6452d426c135'],
      taggedUsers: ['5e02eeaf6ebf6452d426c135'],
      minimized: true,
      private: false,
      deleted: false,
      _id: '5e02f1b53e741a3e18c4027b',
      projectId: '5e02efdd94748b21482e6010',
      title: 'New Title',
      body: 'I like my new body.',
      createdAt: '2019-12-25T05:20:53.800Z',
      updatedAt: '2019-12-30T09:07:10.417Z',
      __v: 1
    }
  ]
};

const note = {
  note: {
    authors: ['5e02eeaf6ebf6452d426c135'],
    taggedUsers: ['5e02eeaf6ebf6452d426c135'],
    minimized: true,
    private: false,
    deleted: false,
    _id: '5e02f1b53e741a3e18c4027b',
    projectId: '5e02efdd94748b21482e6010',
    title: 'New Title',
    body: 'I like my new body.',
    createdAt: '2019-12-25T05:20:53.800Z',
    updatedAt: '2019-12-30T09:07:10.417Z',
    __v: 1
  }
};

const newNote = {
  title: 'Hello World',
  authors: ['5e0430abbea5ed49649b81e8'],
  body: 'Bodies are cool.',
  projectId: '5e02efdd94748b21482e6010'
};

const createNewNoteFromUserAndProjectIds = (userId, projectId) =>
  _.assign(newNote, { authors: [userId], projectId });

const newUpdateNote = {
  title: 'New Title',
  body: 'I like my new body.',
  authors: ['5e02eeaf6ebf6452d426c135'],
  taggedUsers: ['5e02eeaf6ebf6452d426c135'],
  minimized: true,
  private: false
};

const createUpdateNoteFromUserId = userId =>
  _.assign(newUpdateNote, { authors: [userId], taggedUsers: [userId] });

const projects = {
  projects: [
    {
      authors: ['5e0bb5c61c90231c34596f83'],
      users: [
        '5e0bb5c61c90231c34596f83',
        '5df9778c0f65fddc651e6167',
        '5df97791556bc5bc928b32fb'
      ],
      private: true,
      deleted: false,
      _id: '5e02efdd94748b21482e6010',
      title: 'Hera',
      createdAt: '2019-12-25T05:13:01.264Z',
      updatedAt: '2019-12-25T05:31:27.794Z',
      __v: 0
    },
    {
      authors: ['5e0bb5c61c90231c34596f83'],
      users: [
        '5e0bb5c61c90231c34596f83',
        '5df9778c0f65fddc651e6167',
        '5df97791556bc5bc928b32fb'
      ],
      private: true,
      deleted: false,
      _id: '5e4c34e5890521be2c2de2fe',
      title: 'Poseidon',
      createdAt: '2019-12-25T05:13:01.264Z',
      updatedAt: '2019-12-26T05:31:27.794Z',
      __v: 0
    },
    {
      authors: ['5e0bb5c61c90231c34596f83'],
      users: [
        '5e0bb5c61c90231c34596f83',
        '5df9778c0f65fddc651e6167',
        '5df97791556bc5bc928b32fb'
      ],
      private: true,
      deleted: false,
      _id: '5e4c34e91ff8893429ff8ce6',
      title: 'Hades',
      createdAt: '2019-12-25T05:13:01.264Z',
      updatedAt: '2019-12-27T05:31:27.794Z',
      __v: 0
    },
    {
      authors: ['5e0bb5c61c90231c34596f83'],
      users: [
        '5e0bb5c61c90231c34596f83',
        '5df9778c0f65fddc651e6167',
        '5df97791556bc5bc928b32fb'
      ],
      private: true,
      deleted: false,
      _id: '5e4c34f192e646c363c3a803',
      title: 'Dionysus',
      createdAt: '2019-12-25T05:13:01.264Z',
      updatedAt: '2019-12-28T05:31:27.794Z',
      __v: 0
    }
  ]
};

const project = {
  project: {
    authors: ['5df9778c0f65fddc651e6167'],
    users: ['5df9778c0f65fddc651e6167', '5df97791556bc5bc928b32fb'],
    private: true,
    deleted: false,
    _id: '5e02efdd94748b21482e6010',
    title: 'My Project',
    createdAt: '2019-12-25T05:13:01.264Z',
    updatedAt: '2019-12-25T05:31:27.794Z',
    __v: 0
  }
};

const newProject = {
  title: 'My Project',
  authors: ['5df9778c0f65fddc651e6167']
};

const createNewProjectFromUserId = userId =>
  _.assign(newProject, { authors: [userId] });

const newUpdateProject = {
  private: true
};

const users = {
  users: [
    {
      _id: '5e0bb5c61c90231c34596f83',
      name: 'Alex Kim',
      email: 'alexkim@dev.com',
      role: 'ADMIN'
    }
  ]
};

const user = {
  user: {
    _id: '5e0bb5c61c90231c34596f83',
    name: 'Alex Kim',
    email: 'alexkim@dev.com',
    role: 'ADMIN'
  }
};

const userWithToken = {
  user: {
    _id: '5e0bb5c61c90231c34596f83',
    name: 'Alex Kim',
    email: 'alexkim@dev.com',
    role: 'ADMIN'
  },
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1Nzg1NDYxMjUsImlhdCI6MTU3Nzk0MTMyNX0.ksgtQ8uDQ3322tOhQ4jIkzZjH6B0luhLA1NRKGCG00w',
  refreshToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTBiYjVjNjFjOTAyMzFjMzQ1OTZmODMiLCJuYW1lIjoiQWxleCB0aGUgQm9vYiIsImVtYWlsIjoiYWxleGtpbUBkZXYuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE1ODMxNzM5MjAsImV4cCI6MTU5MTQ2ODMyMH0.-c2fVoAVWTf-8JrinCIpL7U-jymRWUGW-c3_lIMogx4'
};

const loginCredentials = {
  email: 'alexkim@dev.com',
  password: 'Theworstpassword!12345'
};

const newUser = {
  name: 'Alex Kim',
  email: 'alexkim@dev.com',
  password: 'Theworstpassword!12345',
  password2: 'Theworstpassword!12345',
  role: 'ADMIN'
};

const newUser2 = {
  name: 'Alex Kim',
  email: 'alexkim2@dev.com',
  password: 'Theworstpassword!12345',
  password2: 'Theworstpassword!12345'
};

const newUpdateUser = {
  name: 'Alex the Great'
};

const usersTestConstants = {
  users,
  user,
  userWithToken,
  loginCredentials,
  newUser,
  newUser2,
  newUpdateUser
};

const projectsTestConstants = {
  projects,
  project,
  newProject,
  newUpdateProject,
  createNewProjectFromUserId,
  createUpdateNoteFromUserId
};

const notesTestConstants = {
  notes,
  note,
  newNote,
  newUpdateNote,
  createNewNoteFromUserAndProjectIds,
  createUpdateNoteFromUserId
};

export default {
  users: usersTestConstants,
  projects: projectsTestConstants,
  notes: notesTestConstants
};
