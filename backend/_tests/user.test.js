process.env.NODE_ENV = "testing";

const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");

// const should = chai.should();

const server = require("../server");
const User = require("../models/user.model");

chai.use(chaiHttp);

// Clean out mongoose models for each test
mongoose.models = {};
mongoose.modelSchemas = {};

describe("User", () => {
  beforeEach(done => {
    User.deleteMany({}, () => {
      done();
    });
  });
  /*
   * Test /GET
   */
  describe("/GET users", () => {
    it("it should GET all the users", done => {
      chai
        .request(server)
        .get("/users")
        .end((err, res) => {
          res.should.have.status(204);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
});
