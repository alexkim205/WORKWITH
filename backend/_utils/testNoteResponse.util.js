const { expect } = require("chai");

const testNoteResponse = (res, noteToCompare) => {
  expect(res).to.be.an("object");
  expect(res).to.have.property("body");
  expect(res.body).to.have.property("note");
  expect(res.body.note).to.have.keys(
    "_id",
    "__v",
    "authors",
    "taggedUsers",
    "minimized",
    "private",
    "deleted",
    "projectId",
    "title",
    "body",
    "createdAt",
    "updatedAt"
  );
  expect(res.body.note.authors).to.eql(noteToCompare.authors);
  expect(res.body.note.projectId).to.equal(noteToCompare.projectId);
  expect(res.body.note.title).to.equal(noteToCompare.title);
  expect(res.body.note.body).to.equal(noteToCompare.body);
};

module.exports = testNoteResponse;
