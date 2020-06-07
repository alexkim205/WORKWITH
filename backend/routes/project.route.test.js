/* eslint-disable no-console */
process.env.NODE_ENV = "testing";

const chai = require("chai");
const chaiHttp = require("chai-http");
const _ = require("lodash");
const to = require("await-to-js").default;

const app = require("../server");
const { User, Admin } = require("../models/user.model");
const Project = require("../models/project.model");
const Note = require("../models/note.model");
const { admin, user, project } = require("../_constants/test.constants");
const { getApiBase } = require("../_config/getEnv.config");
const { HttpStatus } = require("../_constants/error.constants");
const testProjectResponse = require("../_utils/testProjectResponse.util");

const { expect } = chai;
chai.use(chaiHttp);

describe("Project", () => {
  let sendableAdminProject; // project with authors filled out
  let adminId;
  let adminToken;
  let userId;
  let userToken;
  let adminProjectId;

  before(async () => {
    // New server and clean database
    await app.tListen();

    // Create users to associate notes with
    const newAdmin = new Admin(_.pick(admin, ["name", "email"]));
    newAdmin.setPassword(admin.password);
    const [adminErr] = await to(newAdmin.save());
    if (!_.isEmpty(adminErr)) {
      throw new Error(`Error: ${adminErr}`);
    }
    const resAdmin = await chai
      .request(app)
      .post(`${getApiBase()}/users/login`)
      .send(_.pick(admin, ["email", "password"]));
    adminId = resAdmin.body.user._id.toString();
    adminToken = resAdmin.body.token;

    const newUser = new User(_.pick(user, ["name", "email"]));
    newUser.setPassword(user.password);
    const [userErr] = await to(newUser.save());
    if (!_.isEmpty(userErr)) {
      throw new Error(`Error: ${userErr}`);
    }
    const resUser = await chai
      .request(app)
      .post(`${getApiBase()}/users/login`)
      .send(_.pick(user, ["email", "password"]));
    userId = resUser.body.user._id.toString();
    userToken = resUser.body.token;

    console.log(adminId, adminToken);
    console.log(userId, userToken);

    sendableAdminProject = _.assign({}, project, {
      authors: [adminId],
      users: [adminId]
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
    it("it should not GET all projects", async () => {
      const res = await chai.request(app).get(`${getApiBase()}/projects`);
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
      expect(res).to.not.have.nested.property("body[0]");
    });
  });

  describe("POST /project/add", () => {
    before(async () => Project.deleteMany({}));
    const apiBase = `${getApiBase()}/projects/add`;
    it("it should not POST a project without authors field of array type", async () => {
      const newNote = _.assign({}, sendableAdminProject, {
        authors: "imnotanarray"
      });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newNote)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a project without users field of array type", async () => {
      const newNote = _.assign({}, sendableAdminProject, {
        users: "imnotanarray"
      });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newNote)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a project without title field", async () => {
      const newNote = _.omit(sendableAdminProject, ["title"]);
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newNote)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a project for author that doesn't exist", async () => {
      const newNote = _.assign({}, sendableAdminProject, {
        authors: ["5e05608eba9d0ea7ccd0d74b"]
      });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newNote)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a project for user that doesn't exist", async () => {
      const newNote = _.assign({}, sendableAdminProject, {
        users: ["5e05608eba9d0ea7ccd0d74b"]
      });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newNote)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should POST a project with well formed fields", async () => {
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(sendableAdminProject)
        .set("authorization", `Bearer ${adminToken}`);
      console.log(res.text);
      expect(res.statusCode).to.equal(HttpStatus.CREATED);
      testProjectResponse(res, sendableAdminProject);
      adminProjectId = res.body.project._id.toString();
    });
    it("it should POST a project without authors and users", async () => {
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(_.omit(project, ["authors", "users"]))
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.CREATED);
      testProjectResponse(
        res,
        _.assign({}, project, { authors: [userId], users: [userId] })
      );
    });
  });
  describe("GET /projects/:id", () => {
    const createApiBase = id => `${getApiBase()}/projects/${id}`;

    it("it should not GET project with non ObjectId", async () => {
      const res = await chai
        .request(app)
        .get(createApiBase("idthereforeiamnot"))
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not GET project that doesn't exist", async () => {
      const res = await chai
        .request(app)
        .get(createApiBase("5e0441c26044dfb8d86d8cc0"))
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not GET project without authorization", async () => {
      const res = await chai
        .request(app)
        .get(createApiBase(adminProjectId))
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(res).to.not.have.nested.property("body[0]");
    });

    it("it should GET existing project", async () => {
      const res = await chai
        .request(app)
        .get(createApiBase(adminProjectId))
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testProjectResponse(res, sendableAdminProject);
      expect(res.body.project._id).to.equal(adminProjectId);
    });
  });

  describe("GET /projects", () => {
    it("it should GET all projects with admin authorization", async () => {
      const res = await chai
        .request(app)
        .get(`${getApiBase()}/projects`)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res).to.have.status(HttpStatus.OK);
      expect(res).to.be.an("object");
      expect(res).to.have.property("body");
      expect(res.body).to.have.property("projects");
      expect(res.body.projects).to.have.lengthOf(2);
      expect(res.body.projects[0]).to.have.keys(
        "_id",
        "__v",
        "authors",
        "users",
        "private",
        "deleted",
        "title",
        "createdAt",
        "updatedAt"
      );
      expect(res.body.projects[0].authors).to.deep.eql(
        sendableAdminProject.authors
      );
      expect(res.body.projects[0].users).to.deep.equal(
        sendableAdminProject.users
      );
      expect(res.body.projects[0].title).to.equal(sendableAdminProject.title);
    });
  });

  describe("GET /projects/user/:id", () => {
    it("it should GET all projects for one user", async () => {
      const res = await chai
        .request(app)
        .get(`${getApiBase()}/projects/user/${adminId}`)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res).to.have.status(HttpStatus.OK);
      expect(res).to.be.an("object");
      expect(res).to.have.property("body");
      expect(res.body).to.have.property("projects");
      expect(res.body.projects).to.have.lengthOf(1);
    });
    it("it should not GET all projects without authorization", async () => {
      const res = await chai
        .request(app)
        .get(`${getApiBase()}/projects/user/${adminId}`)
        .set("authorization", `Bearer ${userToken}`);
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
      expect(res).to.not.have.nested.property("body[0]");
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
        .send(createProjectUpdate(adminId))
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update a project that doesn't exist", async () => {
      const res = await chai
        .request(app)
        .put(createApiBase("5e0441c26044dfb8d86d8cc0"))
        .send(createProjectUpdate(adminId))
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update a note for author with non ObjectId", async () => {
      const newProjectUpdate = _.assign({}, createProjectUpdate(adminId), {
        authors: ["idthereforeiamnot"]
      });
      const res = await chai
        .request(app)
        .put(createApiBase(adminProjectId))
        .send(newProjectUpdate)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update a note for author that doesn't exist", async () => {
      const newProjectUpdate = _.assign({}, createProjectUpdate(adminId), {
        authors: ["5e0441c26044dfb8d86d8cc0"]
      });
      const res = await chai
        .request(app)
        .put(createApiBase(adminProjectId))
        .send(newProjectUpdate)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update a project without authors field of array type", async () => {
      const newProjectUpdate = _.assign({}, createProjectUpdate(adminId), {
        authors: "imnotanarray"
      });
      const res = await chai
        .request(app)
        .put(createApiBase(adminProjectId))
        .send(newProjectUpdate)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update a note for user with non ObjectId", async () => {
      const newProjectUpdate = _.assign({}, createProjectUpdate(adminId), {
        users: ["idthereforeiamnot"]
      });
      const res = await chai
        .request(app)
        .put(createApiBase(adminProjectId))
        .send(newProjectUpdate)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update a note for user that doesn't exist", async () => {
      const newProjectUpdate = _.assign({}, createProjectUpdate(adminId), {
        users: ["5e0441c26044dfb8d86d8cc0"]
      });
      const res = await chai
        .request(app)
        .put(createApiBase(adminProjectId))
        .send(newProjectUpdate)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update a project without users field of array type", async () => {
      const newProjectUpdate = _.assign({}, createProjectUpdate(adminId), {
        users: "imnotanarray"
      });
      const res = await chai
        .request(app)
        .put(createApiBase(adminProjectId))
        .send(newProjectUpdate)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update the delete field", async () => {
      const newProjectUpdate = _.assign({}, createProjectUpdate(adminId), {
        deleted: false
      });
      const res = await chai
        .request(app)
        .put(createApiBase(adminProjectId))
        .send(newProjectUpdate)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update without any fields", async () => {
      const res = await chai
        .request(app)
        .put(createApiBase(adminProjectId))
        .send({})
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update a project without private field of boolean type", async () => {
      const newProjectUpdate = _.assign({}, createProjectUpdate(adminId), {
        private: "imnotaboolean"
      });
      const res = await chai
        .request(app)
        .put(createApiBase(adminProjectId))
        .send(newProjectUpdate)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update without authorization", async () => {
      const newProjectUpdate = createProjectUpdate(adminId);
      const res = await chai
        .request(app)
        .put(createApiBase(adminProjectId))
        .send(newProjectUpdate)
        .set("authorization", `Bearer ${userToken}`);
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should PUT update with well formed request", async () => {
      const newProjectUpdate = createProjectUpdate(adminId);
      const projectToCheck = _.assign(
        {},
        sendableAdminProject,
        newProjectUpdate
      );
      const res = await chai
        .request(app)
        .put(createApiBase(adminProjectId))
        .send(newProjectUpdate)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testProjectResponse(res, projectToCheck);
      expect(res.body.project._id).to.equal(adminProjectId);
    });
    it("it should PUT update without authors and/or users", async () => {
      const newProjectUpdate = _.omit(createProjectUpdate(adminId), [
        "authors",
        "users"
      ]);
      const projectToCheck = _.assign(
        {},
        sendableAdminProject,
        newProjectUpdate,
        { authors: [adminId], users: [adminId], private: false }
      );
      const res = await chai
        .request(app)
        .put(createApiBase(adminProjectId))
        .send(newProjectUpdate)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testProjectResponse(res, projectToCheck);
      expect(res.body.project._id).to.equal(adminProjectId);
    });
    it("it should PUT update without title", async () => {
      const newProjectUpdate = { private: true };
      const projectToCheck = _.assign(
        {},
        sendableAdminProject,
        newProjectUpdate,
        {
          title: "New Title",
          authors: [adminId],
          users: [adminId]
        }
      );
      console.log(projectToCheck);
      const res = await chai
        .request(app)
        .put(createApiBase(adminProjectId))
        .send(newProjectUpdate)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testProjectResponse(res, projectToCheck);
      expect(res.body.project._id).to.equal(adminProjectId);
    });
    it("it should PUT update without private", async () => {
      const newProjectUpdate = _.omit(createProjectUpdate(adminId), [
        "private"
      ]);
      const projectToCheck = _.assign(
        {},
        sendableAdminProject,
        newProjectUpdate,
        { authors: [adminId], users: [adminId], private: false }
      );
      const res = await chai
        .request(app)
        .put(createApiBase(adminProjectId))
        .send(newProjectUpdate)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testProjectResponse(res, projectToCheck);
      expect(res.body.project._id).to.equal(adminProjectId);
    });
  });

  describe("DELETE /projects/:id", () => {
    const createApiBase = id => `${getApiBase()}/projects/${id}`;
    it("it should not DELETE project with non ObjectId", async () => {
      const res = await chai
        .request(app)
        .delete(createApiBase("idthereforeiamnot"))
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not DELETE project that doesn't exist", async () => {
      const res = await chai
        .request(app)
        .delete(createApiBase("5e0441c26044dfb8d86d8cc0"))
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not DELETE project without authorization", async () => {
      const res = await chai
        .request(app)
        .delete(createApiBase(adminProjectId))
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should DELETE project that hasn't been deleted", async () => {
      const res = await chai
        .request(app)
        .delete(createApiBase(adminProjectId))
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should DELETE project that is already deleted", async () => {
      const res = await chai
        .request(app)
        .delete(createApiBase(adminProjectId))
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      expect(res).to.not.have.nested.property("body[0]");
    });
  });
});
