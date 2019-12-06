const config = require('./app/config');

const slack = require('./app/infrastructure/slack');
const createPostgreSQLDatabase = require('./app/infrastructure/postgresql/sequelize');
const createExpressServer = require('./app/infrastructure/webserver/server');
const createPollsRepository = require('./app/interfaces/repositories/pollsRepositoryPostgreSQL');
const createPollAnswersRepository = require('./app/interfaces/repositories/pollAnswersRepositoryPostgreSQL');
const createPollsPresenter = require('./app/interfaces/presenters/pollsPresenterSlack');

async function createApplication() {
  // Sync database
  const sequelize = await createPostgreSQLDatabase();

  // Build data stores and interfaces
  const pollsRepository = createPollsRepository(sequelize);
  const pollAnswersRepository = createPollAnswersRepository(sequelize);
  const pollsPresenter = createPollsPresenter(slack);

  // Create Webserver
  const server = createExpressServer({
    pollsRepository,
    pollAnswersRepository,
    pollsPresenter,
  });

  return server;
}

async function main() {
  const application = await createApplication();

  // Run
  application.listen(config.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`=>> App listen on ${config.PORT}`);
  });
}

main();
