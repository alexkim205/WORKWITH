const { expect } = require("chai");

const Role = require("./roles.util");

const testUserResponse = (
  res,
  userToCompare,
  withToken = false,
  role = Role.USER
) => {
  const keys = ["_id", "name", "email", "role"];
  if (role === Role.USER) {
    keys.push("contacts");
  }
  expect(res).to.be.an("object");
  expect(res).to.have.property("body");
  expect(res.body).to.have.property("user");
  if (withToken) {
    expect(res.body).to.have.property("token");
    expect(res.body).to.have.property("refreshToken");
  }
  expect(res.body.user).to.have.keys(keys);
  expect(res.body.user.name).to.equal(userToCompare.name);
  expect(res.body.user.email).to.equal(userToCompare.email);
};

module.exports = testUserResponse;
