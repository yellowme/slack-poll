const compression = require('compression');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const db = require('./db');
const servicesMiddleware = require('./middlewares/services');
const indexRouter = require('./routes/index');
const hookRouter = require('./routes/hook');
const pollsRouter = require('./routes/polls');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// database middleware
app.use((req, res, next) => {
  req.db = db;
  next();
});

// environment variables handler
app.use((req, res, next) => {
  req.config = config;
  next();
});

// services middleware
app.use(servicesMiddleware);

// application handlers
app.use('/', indexRouter);
app.use('/hook', hookRouter);
app.use('/polls', pollsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
