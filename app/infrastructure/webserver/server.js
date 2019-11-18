const express = require('express');
const morgan = require('morgan');

const createPingHandler = require('./ping');
const createPollHandler = require('./poll');

function createExpressServer() {
  const app = express();

  // App config
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms')
  );

  // Routes
  app.use(createPingHandler());
  app.use(createPollHandler());

  return app;
}

module.exports = createExpressServer;
