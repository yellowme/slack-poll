const createSequelizeDatabase = require('./app/infrastructure/database/sequelize');
const createExpressServer = require('./app/infrastructure/webserver/server');
const slack = require('./app/infrastructure/slack');
const config = require('./app/infrastructure/config');

async function main() {
  const sequelize = await createSequelizeDatabase();
  const server = createExpressServer(sequelize, slack);

  server.listen(config.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`=>> App listen on ${config.PORT}`);
  });
}

main();
