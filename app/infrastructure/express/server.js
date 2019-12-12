const express = require('express');
const { createServer } = require('http');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const createStatusHandler = require('./status');
const createPollsHandler = require('./polls');
const createPollAnswerHandler = require('./hook');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Build express application and return express instance
function createExpressServer({
  pollsRepository,
  pollAnswersRepository,
  pollsPresenter,
}) {
  const app = express();

  // Middleware stack
  app.use(helmet());
  app.use(compression());
  app.use(limiter);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms')
  );

  // Attatch route handlers
  app.use(createStatusHandler());
  app.use(createPollsHandler({ pollsRepository, pollsPresenter }));
  app.use(createPollAnswerHandler({ pollsRepository, pollAnswersRepository }));

  return createServer(app);
}

module.exports = createExpressServer;
