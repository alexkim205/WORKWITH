import _ from "lodash";

const notes = {
  notes: [
    {
      authors: ["5e02eeaf6ebf6452d426c135"],
      taggedUsers: ["5e02eeaf6ebf6452d426c135"],
      minimized: true,
      private: false,
      deleted: false,
      _id: "5e02f1b53e741a3e18c4027b",
      projectId: "5e02efdd94748b21482e6010",
      title: "New Title",
      body: "I like my new body.",
      createdAt: "2019-12-25T05:20:53.800Z",
      updatedAt: "2019-12-30T09:07:10.417Z",
      __v: 1
    }
  ]
};

const note = {
  note: {
    authors: ["5e02eeaf6ebf6452d426c135"],
    taggedUsers: ["5e02eeaf6ebf6452d426c135"],
    minimized: true,
    private: false,
    deleted: false,
    _id: "5e02f1b53e741a3e18c4027b",
    projectId: "5e02efdd94748b21482e6010",
    title: "New Title",
    body: "I like my new body.",
    createdAt: "2019-12-25T05:20:53.800Z",
    updatedAt: "2019-12-30T09:07:10.417Z",
    __v: 1
  }
};

const newNote = {
  title: "Hello World",
  authors: ["5e0430abbea5ed49649b81e8"],
  body: "Bodies are cool.",
  projectId: "5e02efdd94748b21482e6010"
};

const createNewNoteFromUserAndProjectIds = (userId, projectId) =>
  _.assign(newNote, { authors: [userId], projectId });

const updateNote = {
  title: "New Title",
  body: "I like my new body.",
  authors: ["5e02eeaf6ebf6452d426c135"],
  taggedUsers: ["5e02eeaf6ebf6452d426c135"],
  minimized: true,
  private: false
};

const createUpdateNoteFromUserId = userId =>
  _.assign(updateNote, { authors: [userId], taggedUsers: [userId] });

const projects = {
  projects: [
    {
      authors: [],
      users: ["5df9778c0f65fddc651e6167", "5df97791556bc5bc928b32fb"],
      private: true,
      deleted: false,
      _id: "5e02efdd94748b21482e6010",
      title: "My Project",
      createdAt: "2019-12-25T05:13:01.264Z",
      updatedAt: "2019-12-25T05:31:27.794Z",
      __v: 0
    }
  ]
};

const project = {
  project: {
    authors: ["5df9778c0f65fddc651e6167"],
    users: ["5df9778c0f65fddc651e6167", "5df97791556bc5bc928b32fb"],
    private: true,
    deleted: false,
    _id: "5e02efdd94748b21482e6010",
    title: "My Project",
    createdAt: "2019-12-25T05:13:01.264Z",
    updatedAt: "2019-12-25T05:31:27.794Z",
    __v: 0
  }
};

const newProject = {
  title: "My Project",
  authors: ["5df9778c0f65fddc651e6167"]
};

const createNewProjectFromUserId = userId =>
  _.assign(newProject, { authors: [userId] });

const updateProject = {
  private: true
};

const users = {
  users: [
    {
      deleted: false,
      _id: "5e0bb5c61c90231c34596f83",
      name: "Alex Kim",
      email: "alexkim@dev.com",
      salt: "563ad7a2ec596b8bdca6cc5b3040e302",
      hash:
        "8a68a2ca14e41925e745d3f5a14550a427aa05c4bc00248e63dc45d12e10e2e3f7e1e09822dd544c1f808dd71eb1aa6538b96408ff73d2ecfd9b54b204fad705",
      createdAt: "2019-12-31T20:55:34.424Z",
      updatedAt: "2019-12-31T20:55:34.424Z",
      __v: 0
    }
  ]
};

const user = {
  user: {
    deleted: false,
    _id: "5e0bb5c61c90231c34596f83",
    name: "Alex Kim",
    email: "alexkim@dev.com",
    salt: "563ad7a2ec596b8bdca6cc5b3040e302",
    hash:
      "8a68a2ca14e41925e745d3f5a14550a427aa05c4bc00248e63dc45d12e10e2e3f7e1e09822dd544c1f808dd71eb1aa6538b96408ff73d2ecfd9b54b204fad705",
    createdAt: "2019-12-31T20:55:34.424Z",
    updatedAt: "2019-12-31T20:55:34.424Z",
    __v: 0
  }
};

const userWithToken = {
  user: {
    deleted: false,
    _id: "5e0bb5c61c90231c34596f83",
    name: "Alex the Great",
    email: "alexkim@dev.com",
    salt: "563ad7a2ec596b8bdca6cc5b3040e302",
    hash:
      "8a68a2ca14e41925e745d3f5a14550a427aa05c4bc00248e63dc45d12e10e2e3f7e1e09822dd544c1f808dd71eb1aa6538b96408ff73d2ecfd9b54b204fad705",
    createdAt: "2019-12-31T20:55:34.424Z",
    updatedAt: "2019-12-31T21:00:15.298Z",
    __v: 0
  },
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1Nzg1NDYxMjUsImlhdCI6MTU3Nzk0MTMyNX0.ksgtQ8uDQ3322tOhQ4jIkzZjH6B0luhLA1NRKGCG00w"
};

const loginCredentials = {
  email: "alexkim@dev.com",
  password: "Theworstpassword!12345"
};

const newUser = {
  name: "Alex Kim",
  email: "alexkim@dev.com",
  password: "Theworstpassword!12345",
  password2: "Theworstpassword!12345"
};

const newUser2 = {
  name: "Alex Kim",
  email: "alexkim2@dev.com",
  password: "Theworstpassword!12345",
  password2: "Theworstpassword!12345"
};

const updateUser = {
  name: "Alex the Great"
};

const usersTestConstants = {
  users,
  user,
  userWithToken,
  loginCredentials,
  newUser,
  newUser2,
  updateUser
};

const projectsTestConstants = {
  projects,
  project,
  newProject,
  updateProject,
  createNewProjectFromUserId,
  createUpdateNoteFromUserId
};

const notesTestConstants = {
  notes,
  note,
  newNote,
  updateNote,
  createNewNoteFromUserAndProjectIds,
  createUpdateNoteFromUserId
};

export default {
  users: usersTestConstants,
  projects: projectsTestConstants,
  notes: notesTestConstants
};
