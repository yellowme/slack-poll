const createSequelizeTestDatabase = require('./sequelize');
const createPollsRepository = require('./repositories/pollsRepository');
const createPollAnswersRepository = require('./repositories/pollAnswersRepository');
const createPollsPresenter = require('./presenters/pollsPresenter');
const slack = require('./slack');
const createExpressServer = require('../app/infrastructure/express/server');

module.exports = async function createTestApplication() {
  // Sync database
  const sequelize = await createSequelizeTestDatabase();

  // Build data stores and interfaces
  const pollsRepository = createPollsRepository(sequelize);
  const pollAnswersRepository = createPollAnswersRepository(sequelize);
  const pollsPresenter = createPollsPresenter(slack);

  // Create Webserver
  const server = createExpressServer({
    repositories: {
      pollsRepository,
      pollAnswersRepository,
    },
    presenters: {
      pollsPresenter,
    },
  });

  return {
    server,
    sequelize,
    repositories: {
      pollsRepository,
      pollAnswersRepository,
    },
    presenters: {
      pollsPresenter,
    },
  };
};
