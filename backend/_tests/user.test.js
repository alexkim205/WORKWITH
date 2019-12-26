/* eslint-disable no-console */
process.env.NODE_ENV = "testing";

const chai = require("chai");
const chaiHttp = require("chai-http");
const _ = require("lodash");
const User = require("../models/user.model");
const { getApiBase } = require("../_config/getEnv.config");

const { expect } = chai;
chai.use(chaiHttp);

const app = require("../server");

const user = {
  name: "Alex Kim",
  email: "alexkim@dev.com",
  password: "Theworstpassword!12345",
  password2: "Theworstpassword!12345"
};

describe("User", () => {
  // New server and clean database
  before(() => app.tListen);
  after(() => app.tClose);

  describe("/GET users", () => {
    before(async () => User.deleteMany({}));
    it("it should GET all users", async () => {
      const res = await chai.request(app).get(`${getApiBase()}/users`);
      expect(res).to.have.status(204);
      expect(res).to.not.have.nested.property("body[0]");
    });
  });

  describe("/POST user", () => {
    before(async () => User.deleteMany({}));
    const apiBase = `${getApiBase()}/users/add`;
    it("it should not POST a user without name field", async () => {
      const newUser = _.omit(user, ["name"]);
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newUser);
      expect(res.statusCode).to.equal(422);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a user without email field", async () => {
      const newUser = _.omit(user, ["email"]);
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newUser);
      expect(res.statusCode).to.equal(422);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a user without password2 field", async () => {
      const newUser = _.omit(user, ["password2"]);
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newUser);
      expect(res.statusCode).to.equal(422);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should not POST a user when passwords don't match", async () => {
      const newUser = _.assign(_.omit(user, ["password2"]), {
        password2: "doesntmatch"
      });
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(newUser);
      expect(res.statusCode).to.equal(422);
      expect(res).to.not.have.nested.property("body[0]");
    });
    it("it should POST a user", async () => {
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(user);
      expect(res.statusCode).to.equal(201);
      expect(res).to.be.an("object");
      expect(res).to.have.property("body");
      expect(res.body).to.have.keys("user", "token");
      expect(res.body.user).to.have.keys(
        "_id",
        "__v",
        "name",
        "email",
        "deleted",
        "createdAt",
        "updatedAt"
      );
      expect(res.body.user.name).to.equal(user.name);
      expect(res.body.user.email).to.equal(user.email);
    });
    it("it should not POST a duplicate user", async () => {
      const res = await chai
        .request(app)
        .post(apiBase)
        .send(user);
      expect(res.statusCode).to.equal(400);
      expect(res).to.not.have.nested.property("body[0]");
    });
  });
});
