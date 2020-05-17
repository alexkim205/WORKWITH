import testUserResponse from './testUserResponse.util';

const testNoteResponse = note => {
  expect(note).toMatchSnapshot({
    __v: expect.any(Number),
    _id: expect.any(String),
    createdAt: expect.any(String),
    deleted: expect.any(Boolean),
    private: expect.any(Boolean),
    minimized: expect.any(Boolean),
    title: expect.any(String),
    body: expect.any(String),
    authors: expect.any(Array),
    taggedUsers: expect.any(Array),
    updatedAt: expect.any(String)
  });
  note.authors.forEach(author => testUserResponse(author));
  note.taggedUsers.forEach(taggedUser => testUserResponse(taggedUser));
};

export default testNoteResponse;
