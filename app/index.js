const config = require('./config');
const slackWebApi = require('./infrastructure/slack-web-api');
const createPostgreSQLDatabase = require('./infrastructure/postgresql/sequelize');
const createExpressServer = require('./infrastructure/webserver/server');
const createPollsRepository = require('./interfaces/repositories/pollsRepositoryPostgreSQL');
const createPollAnswersRepository = require('./interfaces/repositories/pollAnswersRepositoryPostgreSQL');
const createPollsPresenter = require('./interfaces/presenters/pollsPresenterSlack');

module.exports = async function createApplication() {
  // Sync database
  const sequelize = await createPostgreSQLDatabase();

  // Build data stores and interfaces
  const pollsRepository = createPollsRepository(sequelize);
  const pollAnswersRepository = createPollAnswersRepository(sequelize);
  const pollsPresenter = createPollsPresenter(slackWebApi);

  // Create Webserver
  const server = createExpressServer({
    pollsRepository,
    pollAnswersRepository,
    pollsPresenter,
  });

  return {
    run: () => {
      server.listen(config.PORT, () =>
        console.log(`=>> App listen on ${config.PORT}`)
      );
    },
  };
};
