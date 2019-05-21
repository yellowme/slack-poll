const express = require('express');
const morgan = require('morgan');

const controller = require('./controller');

const app = express();

// App config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms')
);

// Route controllers
app.post('/poll', controller.pollPost);
app.post('/hook', controller.hookPost);
app.get('/ping', (req, res) => res.json({ on: true }));

module.exports = app;
