/* eslint-disable no-console */
process.env.NODE_ENV = "testing";

const chai = require("chai");
const chaiHttp = require("chai-http");
const _ = require("lodash");
const to = require("await-to-js").default;
const isEmpty = require("is-empty");

const app = require("../server");
const User = require("../models/user.model");
const Project = require("../models/project.model");
const Note = require("../models/note.model");
const { user, project, note } = require("../_constants/test.constants");
const { getApiBase } = require("../_config/getEnv.config");
const { HttpStatus } = require("../_constants/error.constants");
const testNoteResponse = require("../_utils/testNoteResponse.util");

const { expect } = chai;
chai.use(chaiHttp);

describe("Note", () => {
  let sendableNote; // note with authors and projectId filled out
  let userId;
  let projectId;
  let noteId;

  before(async () => {
    // New server and clean database
    await app.tListen();

    // Create user to associate notes with
    const newUser = new User({
      name: user.name,
      email: user.email
    });
    [newUser.salt, newUser.hash] = newUser.setPassword(user.password);
    const [userErr, returnedUser] = await to(newUser.save());
    if (!isEmpty(userErr)) {
      throw new Error(`Error: ${userErr}`);
    }
    userId = returnedUser._id.toString();

    // Create project that notes can exist in
    const newProject = new Project({
      title: project.title,
      authors: [userId]
    });
    const [projectErr, returnedProject] = await to(newProject.save());
    if (!isEmpty(projectErr)) {
      throw new Error(`Error: ${userErr}`);
    }
    projectId = returnedProject._id.toString();

    sendableNote = _.assign({}, note, { authors: [userId], projectId });
  });
  after(async () => {
    await app.tClose();
    await User.deleteMany({});
    await Project.deleteMany({});
    await Note.deleteMany({});
  });

  describe("GET /notes", () => {
    before(async () => Note.deleteMany({}));
    it("it should GET all notes", async () => {
      const res = await chai.request(app).get(`${getApiBase()}/notes`);
      expect(res).to.have.status(HttpStatus.NO_CONTENT);
      expect(res).to.not.have.nested.property("body[0]");
    });
  });

  describe("POST /notes/add", () => {
    before(async () => Note.deleteMany({}));
    const apiBase = `${getApiBase()}/notes/add`;
    it("it should not POST a note without authors field", async () => {
      const newNote = _.omit(sendableNote, ["authors"]);
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newNote);
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a note without authors field of array type", async () => {
      const newNote = _.assign({}, sendableNote, { authors: "imnotanarray" });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newNote);
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a note without projectId field", async () => {
      const newNote = _.omit(sendableNote, ["projectId"]);
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newNote);
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a note without valid projectId field", async () => {
      const newNote = _.assign({}, sendableNote, {
        projectId: "imnotanobjectid"
      });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newNote);
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a note without authors and projectId fields", async () => {
      const newNote = _.omit(sendableNote, ["authors", "projectId"]);
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newNote);
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a note for user that doesn't exist", async () => {
      const newNote = _.assign({}, sendableNote, {
        authors: ["5e05608eba9d0ea7ccd0d74b"]
      });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newNote);
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a note for project that doesn't exist", async () => {
      const newNote = _.assign({}, sendableNote, {
        projectId: "5e05608eba9d0ea7ccd0d74b"
      });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newNote);
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should POST a note with well formed authors and projectId fields", async () => {
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(sendableNote);
      expect(res.statusCode).to.equal(HttpStatus.CREATED);
      testNoteResponse(res, sendableNote);
    });
  });
  describe("GET /notes/:id", () => {
    const createApiBase = id => `${getApiBase()}/notes/${id}`;
    before(async () => {
      // Find id of note we created above
      const [err, foundNote] = await to(Note.findOne({ title: note.title }));
      if (!isEmpty(err)) {
        throw new Error(`Error: ${err}`);
      }
      if (isEmpty(foundNote)) {
        throw new Error(`Error: Note with title ${note.title} NOT_FOUND`);
      }
      noteId = foundNote._id.toString();
    });
    it("it should not GET note with non ObjectId", async () => {
      const res = await chai
        .request(app)
        .get(createApiBase("idthereforeiamnot"));
      expect(res.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not GET note that doesn't exist", async () => {
      const res = await chai
        .request(app)
        .get(createApiBase("5e0441c26044dfb8d86d8cc0"));
      expect(res.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });

    it("it should GET existing note", async () => {
      const res = await chai.request(app).get(createApiBase(noteId));
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testNoteResponse(res, sendableNote);
      expect(res.body.note._id).to.equal(noteId);
    });
  });

  describe("PUT /notes/update/:id", () => {
    const createApiBase = id => `${getApiBase()}/notes/update/${id}`;
    const noteUpdate = {
      title: "New Title",
      body: "I like my new body.",
      taggedUsers: [userId], // tag author
      minimized: true,
      private: false
    };
    it("it should not PUT note with non ObjectId", async () => {
      const res = await chai
        .request(app)
        .put(createApiBase("idthereforeiamnot"))
        .send(noteUpdate);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update a note that doesn't exist", async () => {
      const res = await chai
        .request(app)
        .put(createApiBase("5e0441c26044dfb8d86d8cc0"))
        .send(noteUpdate);
      expect(res.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update the delete field", async () => {
      const newNoteUpdate = _.assign({}, noteUpdate, { deleted: false });
      const res = await chai
        .request(app)
        .put(createApiBase(noteId))
        .send(newNoteUpdate);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update without any fields", async () => {
      const res = await chai
        .request(app)
        .put(createApiBase(noteId))
        .send({});
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
  });
});
