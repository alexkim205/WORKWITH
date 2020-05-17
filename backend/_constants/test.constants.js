const _ = require("lodash");
const Role = require("../_utils/roles.util");

const user = {
  name: "Alex Kim", // required
  email: "alexkim@dev.com", // required
  password: "Theworstpassword!12345", // required
  password2: "Theworstpassword!12345" // required
};

const admin = {
  name: "Admin", // required
  email: "admin@dev.com", // required
  password: "Theworstpassword!12345", // required
  password2: "Theworstpassword!12345", // required
  role: Role.ADMIN
};

const project = {
  title: "Hello World", // required
  authors: [], // required
  private: true
};

const fullNote = {
  title: "Hello World",
  authors: [], // required
  taggedUsers: [],
  body: "Bodies are cool.",
  projectId: null, // required
  minimized: false,
  private: true
};

const bareNote = _.pick(fullNote, ["title", "authors", "body", "projectId"]);

module.exports = {
  user,
  admin,
  project,
  note: bareNote
};
