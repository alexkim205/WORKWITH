/* eslint-disable no-console */
process.env.NODE_ENV = "testing";

const chai = require("chai");
const chaiHttp = require("chai-http");
const _ = require("lodash");

const app = require("../server");
const User = require("../models/user.model");
const { admin: user } = require("../_constants/test.constants");
const { getApiBase } = require("../_config/getEnv.config");
const { HttpStatus } = require("../_constants/error.constants");
const testUserResponse = require("../_utils/testUserResponse.util");

const { expect } = chai;
chai.use(chaiHttp);

describe("User", () => {
  // New server and clean database
  before(() => app.tListen);
  after(async () => {
    await app.tClose();
    await User.deleteMany({});
  });

  let userId;
  let userToken;

  describe("GET /users", () => {
    before(async () => User.deleteMany({}));
    it("it should not GET all users", async () => {
      const res = await chai.request(app).get(`${getApiBase()}/users`);
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
      expect(res).to.not.have.nested.property("body[0]");
    });
  });

  describe("POST /users/add", () => {
    before(async () => User.deleteMany({}));
    const apiBase = `${getApiBase()}/users/add`;
    it("it should not POST a user without name field", async () => {
      const newUser = _.omit(user, ["name"]);
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newUser);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a user without email field", async () => {
      const newUser = _.omit(user, ["email"]);
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newUser);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a user without valid email field", async () => {
      const newUser = _.assign({}, user, { email: "alexkim.dev" });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newUser);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a user without password fields", async () => {
      const newUser = _.omit(user, ["password", "password2"]);
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newUser);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a user without password2 field", async () => {
      const newUser = _.omit(user, ["password2"]);
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newUser);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a user when passwords don't match", async () => {
      const newUser = _.assign({}, user, { password2: "doesntmatch" });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newUser);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a user when password is too short", async () => {
      const newUser = _.assign({}, user, { password: "abc", password2: "abc" });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newUser);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a user when password is too long", async () => {
      const newUser = _.assign({}, user, {
        password: "0123456789abcdefghijklmnopqrstuvwxyz",
        password2: "0123456789abcdefghijklmnopqrstuvwxyz"
      });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newUser);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should POST a user", async () => {
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(user);
      expect(res.statusCode).to.equal(HttpStatus.CREATED);
      testUserResponse(res, user, true);
    });
    it("it should not POST a duplicate user", async () => {
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(user);
      expect(res.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(res).to.not.have.nested.property("body[0]");
    });
  });

  describe("POST /users/login", () => {
    const apiBase = `${getApiBase()}/users/login`;
    const credentials = _.pick(user, ["email", "password"]);

    it("it should not POST login without email field", async () => {
      const newCredentials = _.omit(credentials, ["email"]);
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newCredentials);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST login without valid email field", async () => {
      const newCredentials = _.assign({}, credentials, {
        email: "alexkim.dev"
      });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newCredentials);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST login without password field", async () => {
      const newCredentials = _.omit(credentials, ["password"]);
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newCredentials);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST login without correct email", async () => {
      const newCredentials = _.assign({}, credentials, {
        email: "alexgkim@dev.com"
      });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newCredentials);
      expect(res.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST login without correct password", async () => {
      const newCredentials = _.assign({}, credentials, {
        password: "imaverybadpassword"
      });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newCredentials);
      expect(res.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should POST login with correct credentials", async () => {
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(credentials);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testUserResponse(res, user, true);
      userId = res.body.user._id.toString();
      userToken = res.body.token;
    });
  });

  describe("GET /users/:id", () => {
    const createApiBase = id => `${getApiBase()}/users/${id}`;

    it("it should not GET user with non ObjectId", async () => {
      const res = await chai
        .request(app)
        .get(createApiBase("idthereforeiamnot"))
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not GET user that doesn't exist", async () => {
      const res = await chai
        .request(app)
        .get(createApiBase("5e0441c26044dfb8d86d8cc0"))
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should GET existing user", async () => {
      const res = await chai
        .request(app)
        .get(createApiBase(userId))
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testUserResponse(res, user);
      expect(res.body.user._id).to.equal(userId);
    });
  });

  describe("PUT /users/update/:id", () => {
    const createApiBase = id => `${getApiBase()}/users/update/${id}`;
    const userUpdate = {
      name: "Alex the Great",
      email: "alexthegreat@dev.com"
    };
    it("it should not PUT user with non ObjectId", async () => {
      const res = await chai
        .request(app)
        .put(createApiBase("idthereforeiamnot"))
        .send(userUpdate)
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update a user that doesn't exist", async () => {
      const res = await chai
        .request(app)
        .put(createApiBase("5e0441c26044dfb8d86d8cc0"))
        .send(userUpdate)
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update the delete field", async () => {
      const newUserUpdate = _.assign({}, userUpdate, { deleted: false });
      const res = await chai
        .request(app)
        .put(createApiBase(userId))
        .send(newUserUpdate)
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update without name and email field", async () => {
      const res = await chai
        .request(app)
        .put(createApiBase(userId))
        .send({})
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update without valid email field", async () => {
      const newUserUpdate = _.assign({}, userUpdate, { email: "alexkim.dev" });
      const res = await chai
        .request(app)
        .put(createApiBase(userId))
        .send(newUserUpdate)
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should PUT update with only name field", async () => {
      const newUserUpdate = _.pick(userUpdate, ["name"]);
      const res = await chai
        .request(app)
        .put(createApiBase(userId))
        .send(newUserUpdate)
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testUserResponse(res, _.assign({}, user, newUserUpdate));
    });
    it("it should PUT update with only email field", async () => {
      const newUserUpdate = _.pick(userUpdate, ["email"]);
      const res = await chai
        .request(app)
        .put(createApiBase(userId))
        .send(newUserUpdate)
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testUserResponse(res, userUpdate);
    });
    it("it should PUT update with both name and email fields", async () => {
      const res = await chai
        .request(app)
        .put(createApiBase(userId))
        .send(user)
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testUserResponse(res, user);
    });
  });

  describe("DELETE /users/:id", () => {
    const createApiBase = id => `${getApiBase()}/users/${id}`;
    it("it should not DELETE user with non ObjectId", async () => {
      const res = await chai
        .request(app)
        .delete(createApiBase("idthereforeiamnot"))
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not DELETE user that doesn't exist", async () => {
      const res = await chai
        .request(app)
        .delete(createApiBase("5e0441c26044dfb8d86d8cc0"))
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should DELETE user that hasn't been deleted", async () => {
      const res = await chai
        .request(app)
        .delete(createApiBase(userId))
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should DELETE user that is already deleted", async () => {
      const res = await chai
        .request(app)
        .delete(createApiBase(userId))
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      expect(res).to.not.have.nested.property("body[0]");
    });
  });
});
