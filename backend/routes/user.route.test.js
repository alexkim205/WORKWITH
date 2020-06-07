/* eslint-disable no-console */
process.env.NODE_ENV = "testing";

const chai = require("chai");
const chaiHttp = require("chai-http");
const _ = require("lodash");

const app = require("../server");
const { BaseUser, User } = require("../models/user.model");
const { admin, user } = require("../_constants/test.constants");
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

  let adminId;
  let adminToken;
  let adminRefreshToken;

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
    before(async () => BaseUser.deleteMany({}));
    after(async () =>
      BaseUser.findOneAndUpdate(
        { email: admin.email },
        {
          role: Role.ADMIN
        },
        { new: true }
      )
    );
    const apiBase = `${getApiBase()}/users/add`;
    it("it should not POST a user without name field", async () => {
      const newUser = _.omit(admin, ["name"]);
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newUser);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a user without email field", async () => {
      const newUser = _.omit(admin, ["email"]);
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newUser);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a user without valid email field", async () => {
      const newUser = _.assign({}, admin, { email: "alexkim.dev" });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newUser);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a user without password fields", async () => {
      const newUser = _.omit(admin, ["password", "password2"]);
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newUser);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a user without password2 field", async () => {
      const newUser = _.omit(admin, ["password2"]);
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newUser);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a user when passwords don't match", async () => {
      const newUser = _.assign({}, admin, { password2: "doesntmatch" });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newUser);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a user when password is too short", async () => {
      const newUser = _.assign({}, admin, {
        password: "abc",
        password2: "abc"
      });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newUser);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a user when password is too long", async () => {
      const newUser = _.assign({}, admin, {
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
        .send(admin);
      expect(res.statusCode).to.equal(HttpStatus.CREATED);
      testUserResponse(res, admin, true);
    });
    it("it should not POST a duplicate user", async () => {
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(admin);
      expect(res.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should POST a different user", async () => {
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(user);
      expect(res.statusCode).to.equal(HttpStatus.CREATED);
      testUserResponse(res, user, true);
    });
  });

  describe("POST /users/login", () => {
    const apiBase = `${getApiBase()}/users/login`;
    const adminCredentials = _.pick(admin, ["email", "password"]);
    const userCredentials = _.pick(user, ["email", "password"]);

    it("it should not POST login without email field", async () => {
      const newCredentials = _.omit(adminCredentials, ["email"]);
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newCredentials);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST login without valid email field", async () => {
      const newCredentials = _.assign({}, adminCredentials, {
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
      const newCredentials = _.omit(adminCredentials, ["password"]);
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newCredentials);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST login without correct email", async () => {
      const newCredentials = _.assign({}, adminCredentials, {
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
      const newCredentials = _.assign({}, adminCredentials, {
        password: "imaverybadpassword"
      });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newCredentials);
      expect(res.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should POST login admin with correct credentials", async () => {
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(adminCredentials);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testUserResponse(res, admin, true, Role.ADMIN);
      adminId = res.body.user._id.toString();
      adminToken = res.body.token;
      adminRefreshToken = res.body.refreshToken;
    });
    it("it should POST login user with correct credentials", async () => {
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(userCredentials);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testUserResponse(res, user, true, Role.USER);
      userId = res.body.user._id.toString();
      userToken = res.body.token;
    });
  });

  describe("GET /users", () => {
    it("it should GET all users with admin authorization", async () => {
      const res = await chai
        .request(app)
        .get(`${getApiBase()}/users`)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res).to.have.status(HttpStatus.OK);
      expect(res).to.be.an("object");
      expect(res).to.have.property("body");
      expect(res.body).to.have.property("users");
      expect(res.body.users).to.have.lengthOf(2);
      expect(res.body.users[0]).to.have.keys(["_id", "name", "email", "role"]);
      expect(res.body.users[0].name).to.equal(admin.name);
      expect(res.body.users[0].email).to.equal(admin.email);
      expect(res.body.users[0].role).to.equal(Role.ADMIN);
      expect(res.body.users[1]).to.have.keys([
        "_id",
        "name",
        "email",
        "contacts",
        "role"
      ]);
      expect(res.body.users[1].name).to.equal(user.name);
      expect(res.body.users[1].email).to.equal(user.email);
      expect(res.body.users[1].role).to.equal(Role.USER);
    });
  });

  describe("GET /users/:id", () => {
    const createApiBase = id => `${getApiBase()}/users/${id}`;

    it("it should not GET user with non ObjectId", async () => {
      const res = await chai
        .request(app)
        .get(createApiBase("idthereforeiamnot"))
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not GET user that doesn't exist", async () => {
      const res = await chai
        .request(app)
        .get(createApiBase("5e0441c26044dfb8d86d8cc0"))
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not GET user without authorization", async () => {
      const res = await chai
        .request(app)
        .get(createApiBase(adminId))
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should GET existing user", async () => {
      const res = await chai
        .request(app)
        .get(createApiBase(adminId))
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testUserResponse(res, admin, false, Role.ADMIN);
      expect(res.body.user._id).to.equal(adminId);
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
        _.pick(admin, ["name", "email"]),
        { role: Role.ADMIN },
        testCustomUsers
      ),
      token,
      refreshToken
    });
    it("it should not POST refresh token without user object", async () => {
      const userWithTokens = _.omit(
        createUserWithTokens(adminId, adminToken, adminRefreshToken),
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
        adminId,
        adminToken,
        adminRefreshToken,
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
        adminToken,
        adminRefreshToken
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
        adminId,
        adminToken,
        adminRefreshToken,
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
        adminId,
        adminToken,
        adminRefreshToken,
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
        createUserWithTokens(adminId, adminToken, adminRefreshToken),
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
        adminId,
        adminToken,
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
        adminToken,
        adminRefreshToken
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
        adminId,
        adminToken,
        adminRefreshToken,
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
        adminId,
        adminToken,
        adminRefreshToken
      );
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(userWithTokens);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testUserResponse(res, admin, true, Role.ADMIN);
    });
  });

  describe("PUT /users/update/:id", () => {
    const createApiBase = id => `${getApiBase()}/users/update/${id}`;
    const adminUpdate = {
      name: "Alex the Bougie",
      email: "alexthebougie@dev.com"
    };
    const userUpdate = {
      name: "Alex the Pleb",
      email: "alexthepleb@dev.com"
    };
    it("it should not PUT user with non ObjectId", async () => {
      const res = await chai
        .request(app)
        .put(createApiBase("idthereforeiamnot"))
        .send(adminUpdate)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update a user that doesn't exist", async () => {
      const res = await chai
        .request(app)
        .put(createApiBase("5e0441c26044dfb8d86d8cc0"))
        .send(adminUpdate)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update the delete field", async () => {
      const newUserUpdate = _.assign({}, adminUpdate, { deleted: false });
      const res = await chai
        .request(app)
        .put(createApiBase(adminId))
        .send(newUserUpdate)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update without name and email field", async () => {
      const res = await chai
        .request(app)
        .put(createApiBase(adminId))
        .send({})
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update without valid email field", async () => {
      const newUserUpdate = _.assign({}, adminUpdate, { email: "alexkim.dev" });
      const res = await chai
        .request(app)
        .put(createApiBase(adminId))
        .send(newUserUpdate)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not PUT update without authorization", async () => {
      const newUserUpdate = _.pick(adminUpdate, ["name"]);
      const res = await chai
        .request(app)
        .put(createApiBase(adminId))
        .send(newUserUpdate)
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should PUT update with only name field", async () => {
      const newUserUpdate = _.pick(adminUpdate, ["name"]);
      const res = await chai
        .request(app)
        .put(createApiBase(adminId))
        .send(newUserUpdate)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testUserResponse(
        res,
        _.assign({}, admin, newUserUpdate),
        false,
        Role.ADMIN
      );
    });
    it("it should PUT update with only email field", async () => {
      const newUserUpdate = _.pick(adminUpdate, ["email"]);
      const res = await chai
        .request(app)
        .put(createApiBase(adminId))
        .send(newUserUpdate)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testUserResponse(res, adminUpdate, false, Role.ADMIN);
    });
    it("it should PUT update with both name and email fields", async () => {
      const resAdmin = await chai
        .request(app)
        .put(createApiBase(adminId))
        .send(adminUpdate)
        .set("authorization", `Bearer ${adminToken}`);
      expect(resAdmin.statusCode).to.equal(HttpStatus.OK);
      testUserResponse(
        resAdmin,
        _.assign({}, admin, adminUpdate),
        false,
        Role.ADMIN
      );
      const resUser = await chai
        .request(app)
        .put(createApiBase(userId))
        .send(userUpdate)
        .set("authorization", `Bearer ${adminToken}`);
      expect(resUser.statusCode).to.equal(HttpStatus.OK);
      testUserResponse(resUser, _.assign({}, user, userUpdate));
    });
    it("it should not PUT update contacts with invalid contacts", async () => {
      const newUserUpdate = _.assign({}, userUpdate, {
        contacts: ["imnotanobjectid", "noramianemail"]
      });
      const res = await chai
        .request(app)
        .put(createApiBase(userId))
        .send(newUserUpdate)
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should PUT update contacts with new emails", async () => {
      const newUserUpdate = _.assign({}, userUpdate, {
        contacts: [
          "persiaiscool@aol.com",
          "alexiscooler@dev.com",
          "hello@world.gov"
        ]
      });
      const res = await chai
        .request(app)
        .put(createApiBase(userId))
        .send(newUserUpdate)
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testUserResponse(res, _.assign({}, user, newUserUpdate));
    });
    it("it should PUT update contacts with id", async () => {
      const newUserUpdate = _.assign({}, userUpdate, {
        contacts: [adminId]
      });
      const res = await chai
        .request(app)
        .put(createApiBase(userId))
        .send(newUserUpdate)
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      testUserResponse(res, _.assign({}, user, newUserUpdate));
    });
  });

  describe("GET /users", () => {
    it("it should GET all users including implicitly created guests", async () => {
      const res = await chai
        .request(app)
        .get(`${getApiBase()}/users`)
        .set("authorization", `Bearer ${adminToken}`);
      expect(res).to.have.status(HttpStatus.OK);
      expect(res).to.be.an("object");
      expect(res).to.have.property("body");
      expect(res.body).to.have.property("users");
      expect(res.body.users).to.have.lengthOf(5);
    });
  });

  describe("GET /users/:id/contacts", () => {
    const createApiBase = id => `${getApiBase()}/users/${id}/contacts`;

    it("it should not GET contacts for nonexisting user", async () => {
      const res = await chai
        .request(app)
        .get(createApiBase("5e0441c26044dfb8d86d8cc0"))
        .set("authorization", `Bearer ${adminToken}`);
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not GET contacts without authorization", async () => {
      const res = await chai
        .request(app)
        .get(createApiBase(adminId))
        .set("authorization", `Bearer ${userToken}`);
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should GET contacts with admin authorization", async () => {
      const res = await chai
        .request(app)
        .get(createApiBase(userId))
        .set("authorization", `Bearer ${adminToken}`);
      expect(res).to.have.status(HttpStatus.OK);
      expect(res).to.be.an("object");
      expect(res).to.have.property("body");
      expect(res.body).to.have.property("contacts");
      expect(res.body.users).to.have.lengthOf(4);
    });
    it("it should GET no content for user without any contacts", async () => {
      const res = await chai
        .request(app)
        .get(createApiBase(adminId))
        .set("authorization", `Bearer ${adminToken}`);
      expect(res).to.have.status(HttpStatus.NO_CONTENT);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should GET contacts of user", async () => {
      const res = await chai
        .request(app)
        .get(createApiBase(userId))
        .set("authorization", `Bearer ${userToken}`);
      expect(res).to.have.status(HttpStatus.OK);
      expect(res).to.be.an("object");
      expect(res).to.have.property("body");
      expect(res.body).to.have.property("contacts");
      expect(res.body.users).to.have.lengthOf(4);
    });
  });

  describe("DELETE /users/:id", () => {
    const createApiBase = id => `${getApiBase()}/users/${id}`;
    it("it should not DELETE user with non ObjectId", async () => {
      const res = await chai
        .request(app)
        .delete(createApiBase("idthereforeiamnot"))
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not DELETE user that doesn't exist", async () => {
      const res = await chai
        .request(app)
        .delete(createApiBase("5e0441c26044dfb8d86d8cc0"))
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not DELETE user without authorization", async () => {
      const res = await chai
        .request(app)
        .delete(createApiBase(adminId))
        .set("authorization", `Bearer ${userToken}`);
      expect(res.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should DELETE user that hasn't been deleted", async () => {
      const res = await chai
        .request(app)
        .delete(createApiBase(adminId))
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should DELETE user that is already deleted", async () => {
      const res = await chai
        .request(app)
        .delete(createApiBase(adminId))
        .set("authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).to.equal(HttpStatus.OK);
      expect(res).to.not.have.nested.property("body[0]");
    });
  });
});
