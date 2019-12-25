process.env.NODE_ENV = "testing";

const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");
const User = require("../models/user.model");
const { getApiBase } = require("../_config/getEnv.config");

const { expect } = chai;
chai.use(chaiHttp);

before(done => {
  app.on("appStarted", () => {
    done();
  });
});

describe("User", () => {
  beforeEach(done => {
    // Clean out mongoose models for each test
    mongoose.models = {};
    mongoose.modelSchemas = {};
    User.deleteMany({}, () => {
      done();
    });
  });
  /*
   * Test /GET
   */
  describe("/GET users", () => {
    it("it should GET all the users", async () => {
      const res = await chai.request(app).get(`${getApiBase()}/users`);
      // console.log(res)
      expect(res).to.have.status(204);
      // res.should.have.status(204);
      // res.body.should.be.a("array");
      // res.body.length.should.be.eql(0);
    });
  });
});
