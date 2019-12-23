const express = require('express');
const { createServer } = require('http');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const createInterfacesMiddleware = require('./middlewares/interfaces');
const createStatusHandler = require('./routes/status');
const createPollsHandler = require('./routes/polls');
const createPollAnswerHandler = require('./routes/hook');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

function createExpressServer({ repositories, presenters }) {
  const app = express();

  // Middleware stack
  app.use(helmet());
  app.use(compression());
  app.use(limiter);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(createInterfacesMiddleware({ repositories, presenters }));
  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms')
  );

  // Attatch route handlers
  app.use(createStatusHandler());
  app.use(createPollsHandler());
  app.use(createPollAnswerHandler());

  return createServer(app);
}

module.exports = createExpressServer;
