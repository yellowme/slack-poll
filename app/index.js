const config = require('./config');
const slackWebApi = require('./infrastructure/slackWebAPI');
const createPostgreSQLDatabase = require('./infrastructure/sequelize/sequelize');
const createExpressServer = require('./infrastructure/express/server');
const createPollsRepository = require('./infrastructure/express/repositories/pollsRepositoryPostgreSQL');
const createPollAnswersRepository = require('./infrastructure/express/repositories/pollAnswersRepositoryPostgreSQL');
const createPollsPresenter = require('./infrastructure/express/presenters/pollsPresenterSlack');

module.exports = async function createApplication() {
  // Sync database
  const sequelize = await createPostgreSQLDatabase();

  // Build data stores and interfaces
  const pollsRepository = createPollsRepository(sequelize);
  const pollAnswersRepository = createPollAnswersRepository(sequelize);
  const pollsPresenter = createPollsPresenter(slackWebApi);

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
    run: () => {
      server.listen(config.PORT, () =>
        console.log(`=>> App listen on ${config.PORT}`)
      );
    },
  };
};
