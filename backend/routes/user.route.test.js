/* eslint-disable no-console */
process.env.NODE_ENV = "testing";

const chai = require("chai");
const chaiHttp = require("chai-http");
const _ = require("lodash");

const app = require("../server");
const { BaseUser, User } = require("../models/user.model");
const { user } = require("../_constants/test.constants");
const Role = require("../_utils/roles.util");
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
  let userRefreshToken;

  describe("GET /users", () => {
    before(async () => User.deleteMany({}));
    it("it should not GET all users", async () => {
      const res = await chai.request(app).get(`${getApiBase()}/users`);
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
      expect(res).to.not.have.nested.property("body[0]");
    });
  });

  describe("POST /users/add", () => {
    before(async () => BaseUser.deleteMany({}));
    after(async () =>
      BaseUser.findOneAndUpdate(
        { email: user.email },
        {
          role: Role.ADMIN
        },
        { new: true }
      )
    );
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
      testUserResponse(res, user, true, Role.ADMIN);
      userId = res.body.user._id.toString();
      userToken = res.body.token;
      userRefreshToken = res.body.refreshToken;
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
      testUserResponse(res, user, false, Role.ADMIN);
      expect(res.body.user._id).to.equal(userId);
    });
  });

  describe("POST /users/token", () => {
    const apiBase = `${getApiBase()}/users/token`;
    const createUserWithTokens = (
      id,
      token,
      refreshToken,
      testCustomUsers = {}
    ) => ({
      user: _.assign(
        { _id: id },
        _.pick(user, ["name", "email"]),
        { role: Role.ADMIN },
        testCustomUsers
      ),
      token,
      refreshToken
    });
    it("it should not POST refresh token without user object", async () => {
      const userWithTokens = _.omit(
        createUserWithTokens(userId, userToken, userRefreshToken),
        ["user"]
      );
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(userWithTokens);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST refresh token without id", async () => {
      const userWithTokens = createUserWithTokens(
        userId,
        userToken,
        userRefreshToken,
        { _id: null }
      );
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(userWithTokens);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST refresh token with non ObjectId", async () => {
      const userWithTokens = createUserWithTokens(
        "idthereforeiamnot",
        userToken,
        userRefreshToken
      );
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(userWithTokens);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST refresh token without name", async () => {
      const userWithTokens = createUserWithTokens(
        userId,
        userToken,
        userRefreshToken,
        { name: null }
      );
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(userWithTokens);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST refresh token without email", async () => {
      const userWithTokens = createUserWithTokens(
        userId,
        userToken,
        userRefreshToken,
        { email: null }
      );
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(userWithTokens);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST refresh token without refresh token", async () => {
      const userWithTokens = _.omit(
        createUserWithTokens(userId, userToken, userRefreshToken),
        ["refreshToken"]
      );
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(userWithTokens);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST refresh token without valid refresh token", async () => {
      const userWithTokens = createUserWithTokens(
        userId,
        userToken,
        "imnotavalidrefreshtoken"
      );
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(userWithTokens);
      expect(res.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST refresh token for user that doesn't exist", async () => {
      const userWithTokens = createUserWithTokens(
        "5e0441c26044dfb8d86d8cc0",
        userToken,
        userRefreshToken
      );
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(userWithTokens);
      expect(res.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST refresh token for non matching users", async () => {
      const userWithTokens = createUserWithTokens(
        userId,
        userToken,
        userRefreshToken,
        {
          name: "Bob Kim",
          role: Role.USER,
          email: "bobby@dev.com"
        }
      );
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(userWithTokens);
      expect(res.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST refresh token with empty body", async () => {
      const res = await chai
        .request(app)
        .post(apiBase)
        .send({});
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should POST refresh token with correct fields", async () => {
      const userWithTokens = createUserWithTokens(
        userId,
        userToken,
        userRefreshToken
      );
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(userWithTokens);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testUserResponse(res, user, true, Role.ADMIN);
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
      testUserResponse(
        res,
        _.assign({}, user, newUserUpdate),
        false,
        Role.ADMIN
      );
    });
    it("it should PUT update with only email field", async () => {
      const newUserUpdate = _.pick(userUpdate, ["email"]);
      const res = await chai
        .request(app)
        .put(createApiBase(userId))
        .send(newUserUpdate)
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testUserResponse(res, userUpdate, false, Role.ADMIN);
    });
    it("it should PUT update with both name and email fields", async () => {
      const res = await chai
        .request(app)
        .put(createApiBase(userId))
        .send(user)
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testUserResponse(res, user, false, Role.ADMIN);
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
