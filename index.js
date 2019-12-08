const createApplication = require('./app');

async function main() {
  const application = await createApplication();

  // Run
  await application.run();
  console.log('Slack poll runnning');
}

main();
