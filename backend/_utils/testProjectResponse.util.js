const { expect } = require("chai");

const testProjectResponse = (res, projectToCompare) => {
  expect(res).to.be.an("object");
  expect(res).to.have.property("body");
  expect(res.body).to.have.property("project");
  expect(res.body.project).to.have.keys(
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
  expect(res.body.project.authors).to.deep.eql(projectToCompare.authors);
  expect(res.body.project.users).to.deep.equal(projectToCompare.users);
  expect(res.body.project.title).to.equal(projectToCompare.title);
};

module.exports = testProjectResponse;
