import testDatabase from '../_config/setupTestDatabase.config';

describe('Server connection', () => {
  if (process.env.REACT_APP_ENV === 'testing-connection') {
    it('it should connect to test mongod', async () => testDatabase.setup());
    it('it should disconnect from test mongod', async () =>
      testDatabase.disconnect());
  } else {
    it('it should not test server connection', () => {});
  }
});
