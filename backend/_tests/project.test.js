/* eslint-disable no-console */
process.env.NODE_ENV = "testing";

const chai = require("chai");
const chaiHttp = require("chai-http");
const _ = require("lodash");
const to = require("await-to-js").default;

const app = require("../server");
const User = require("../models/user.model");
const Project = require("../models/project.model");
const Note = require("../models/note.model");
const { user, project } = require("../_constants/test.constants");
const { getApiBase } = require("../_config/getEnv.config");
const { HttpStatus } = require("../_constants/error.constants");
const testProjectResponse = require("../_utils/testProjectResponse.util");

const { expect } = chai;
chai.use(chaiHttp);

describe("Project", () => {
  let sendableProject; // project with authors filled out
  let userId;
  let projectId;

  before(async () => {
    // New server and clean database
    await app.tListen();

    // Create user to associate notes with
    const newUser = new User({
      name: user.name,
      email: user.email
    });
    newUser.setPassword(user.password);
    const [userErr, returnedUser] = await to(newUser.save());
    if (!_.isEmpty(userErr)) {
      throw new Error(`Error: ${userErr}`);
    }
    userId = returnedUser._id.toString();

    sendableProject = _.assign({}, project, {
      authors: [userId],
      users: [userId]
    });
  });
  after(async () => {
    await app.tClose();
    await User.deleteMany({});
    await Project.deleteMany({});
    await Note.deleteMany({});
  });

  describe("GET /projects", () => {
    before(async () => Project.deleteMany({}));
    it("it should GET all projects", async () => {
      const res = await chai.request(app).get(`${getApiBase()}/projects`);
      expect(res).to.have.status(HttpStatus.NO_CONTENT);
      expect(res).to.not.have.nested.property("body[0]");
    });
  });

  describe("POST /project/add", () => {
    before(async () => Project.deleteMany({}));
    const apiBase = `${getApiBase()}/projects/add`;
    it("it should not POST a project without authors field", async () => {
      const newNote = _.omit(sendableProject, ["authors"]);
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newNote);
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a project without authors field of array type", async () => {
      const newNote = _.assign({}, sendableProject, {
        authors: "imnotanarray"
      });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newNote);
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a project without users field of array type", async () => {
      const newNote = _.assign({}, sendableProject, {
        users: "imnotanarray"
      });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newNote);
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a project without title field", async () => {
      const newNote = _.omit(sendableProject, ["title"]);
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newNote);
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a project for author that doesn't exist", async () => {
      const newNote = _.assign({}, sendableProject, {
        authors: ["5e05608eba9d0ea7ccd0d74b"]
      });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newNote);
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a project for user that doesn't exist", async () => {
      const newNote = _.assign({}, sendableProject, {
        users: ["5e05608eba9d0ea7ccd0d74b"]
      });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newNote);
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should POST a project with well formed fields", async () => {
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(sendableProject);
      expect(res.statusCode).to.equal(HttpStatus.CREATED);
      testProjectResponse(res, sendableProject);
    });
  });
  describe("GET /projects/:id", () => {
    const createApiBase = id => `${getApiBase()}/projects/${id}`;
    before(async () => {
      // Find id of project we created above
      const [err, foundProject] = await to(
        Project.findOne({ title: project.title })
      );
      if (!_.isEmpty(err)) {
        throw new Error(`Error: ${err}`);
      }
      if (_.isEmpty(foundProject)) {
        throw new Error(`Error: Project with title ${project.title} NOT_FOUND`);
      }
      projectId = foundProject._id.toString();
    });
    it("it should not GET project with non ObjectId", async () => {
      const res = await chai
        .request(app)
        .get(createApiBase("idthereforeiamnot"));
      expect(res.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not GET project that doesn't exist", async () => {
      const res = await chai
        .request(app)
        .get(createApiBase("5e0441c26044dfb8d86d8cc0"));
      expect(res.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });

    it("it should GET existing project", async () => {
      const res = await chai.request(app).get(createApiBase(projectId));
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testProjectResponse(res, sendableProject);
      expect(res.body.project._id).to.equal(projectId);
    });
  });

  describe("PUT /projects/update/:id", () => {
    const createApiBase = id => `${getApiBase()}/projects/update/${id}`;
    const createProjectUpdate = uId => ({
      title: "New Title",
      users: [uId],
      private: false
    });
    it("it should not PUT project with non ObjectId", async () => {
      const res = await chai
        .request(app)
        .put(createApiBase("idthereforeiamnot"))
        .send(createProjectUpdate(userId));
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update a project that doesn't exist", async () => {
      const res = await chai
        .request(app)
        .put(createApiBase("5e0441c26044dfb8d86d8cc0"))
        .send(createProjectUpdate(userId));
      expect(res.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update a note for author with non ObjectId", async () => {
      const newProjectUpdate = _.assign({}, createProjectUpdate(userId), {
        authors: ["idthereforeiamnot"]
      });
      const res = await chai
        .request(app)
        .put(createApiBase(projectId))
        .send(newProjectUpdate);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update a note for author that doesn't exist", async () => {
      const newProjectUpdate = _.assign({}, createProjectUpdate(userId), {
        authors: ["5e0441c26044dfb8d86d8cc0"]
      });
      const res = await chai
        .request(app)
        .put(createApiBase(projectId))
        .send(newProjectUpdate);
      expect(res.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update a project without authors field of array type", async () => {
      const newProjectUpdate = _.assign({}, createProjectUpdate(userId), {
        authors: "imnotanarray"
      });
      const res = await chai
        .request(app)
        .put(createApiBase(projectId))
        .send(newProjectUpdate);
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update a note for user with non ObjectId", async () => {
      const newProjectUpdate = _.assign({}, createProjectUpdate(userId), {
        users: ["idthereforeiamnot"]
      });
      const res = await chai
        .request(app)
        .put(createApiBase(projectId))
        .send(newProjectUpdate);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update a note for user that doesn't exist", async () => {
      const newProjectUpdate = _.assign({}, createProjectUpdate(userId), {
        users: ["5e0441c26044dfb8d86d8cc0"]
      });
      const res = await chai
        .request(app)
        .put(createApiBase(projectId))
        .send(newProjectUpdate);
      expect(res.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update a project without users field of array type", async () => {
      const newProjectUpdate = _.assign({}, createProjectUpdate(userId), {
        users: "imnotanarray"
      });
      const res = await chai
        .request(app)
        .put(createApiBase(projectId))
        .send(newProjectUpdate);
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update the delete field", async () => {
      const newProjectUpdate = _.assign({}, createProjectUpdate(userId), {
        deleted: false
      });
      const res = await chai
        .request(app)
        .put(createApiBase(projectId))
        .send(newProjectUpdate);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update without any fields", async () => {
      const res = await chai
        .request(app)
        .put(createApiBase(projectId))
        .send({});
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update a project without private field of boolean type", async () => {
      const newProjectUpdate = _.assign({}, createProjectUpdate(userId), {
        private: "imnotaboolean"
      });
      const res = await chai
        .request(app)
        .put(createApiBase(projectId))
        .send(newProjectUpdate);
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should PUT update with well formed request", async () => {
      const newProjectUpdate = createProjectUpdate(userId);
      const projectToCheck = _.assign({}, sendableProject, newProjectUpdate);
      const res = await chai
        .request(app)
        .put(createApiBase(projectId))
        .send(newProjectUpdate);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testProjectResponse(res, projectToCheck);
      expect(res.body.project._id).to.equal(projectId);
    });
  });

  describe("DELETE /projects/:id", () => {
    const createApiBase = id => `${getApiBase()}/projects/${id}`;
    it("it should not DELETE project with non ObjectId", async () => {
      const res = await chai
        .request(app)
        .delete(createApiBase("idthereforeiamnot"));
      expect(res.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not DELETE project that doesn't exist", async () => {
      const res = await chai
        .request(app)
        .delete(createApiBase("5e0441c26044dfb8d86d8cc0"));
      expect(res.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should DELETE project that hasn't been deleted", async () => {
      const res = await chai.request(app).delete(createApiBase(projectId));
      expect(res.statusCode).to.equal(HttpStatus.OK);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should DELETE project that is already deleted", async () => {
      const res = await chai.request(app).delete(createApiBase(projectId));
      expect(res.statusCode).to.equal(HttpStatus.OK);
      expect(res).to.not.have.nested.property("body[0]");
    });
  });
});
