const express = require('express');
const morgan = require('morgan');

const createStatusHandler = require('./status');
const createPollsHandler = require('./polls');

// Build express application and return express instance
function createExpressServer({ pollsRepository, pollsPresenter }) {
  const app = express();

  // App config
  // TODO: Add debbuger
  // TODO: Add helmet
  // TODO: Add rate limit
  // TOOD: Add Docs?
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms')
  );

  // Attatch route handlers
  app.use(createStatusHandler());
  app.use(createPollsHandler({ pollsRepository, pollsPresenter }));

  return app;
}

module.exports = createExpressServer;
