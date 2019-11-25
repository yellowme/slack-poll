const config = require('./app/config');

const createSequelizeDatabase = require('./app/infrastructure/database/sequelize');
const createExpressServer = require('./app/infrastructure/webserver/server');
const slack = require('./app/infrastructure/slack');

const createPollsRepository = require('./app/interfaces/repositories/pollRepositorySQLite');
const createPollsPresenter = require('./app/interfaces/presenters/pollsPresenterSlack');

async function createApplication() {
  // Sync database
  const sequelize = createSequelizeDatabase();
  await sequelize.sync();

  // Build data stores and interfaces
  const pollsRepository = createPollsRepository(sequelize);
  const pollsPresenter = createPollsPresenter(slack);

  // Create Webserver
  const server = createExpressServer({ pollsRepository, pollsPresenter });

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
