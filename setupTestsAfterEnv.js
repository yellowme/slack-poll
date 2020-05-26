beforeEach(async () => {
  // eslint-disable-next-line global-require
  const db = require('./db');
  await db.sync();
});

afterEach(() => {
  jest.clearAllMocks();
});
