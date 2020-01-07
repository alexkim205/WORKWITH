const testUserResponse = user => {
  expect(user).toMatchSnapshot({
    __v: expect.any(Number),
    _id: expect.any(String),
    createdAt: expect.any(String),
    deleted: expect.any(Boolean),
    email: expect.any(String),
    hash: expect.any(String),
    name: expect.any(String),
    salt: expect.any(String),
    updatedAt: expect.any(String)
  });
};

export default testUserResponse;
