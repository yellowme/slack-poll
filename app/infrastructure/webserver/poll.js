const express = require('express');

const createPollController = require('../../adapter/pollController');
const createPollRepository = require('../../adapter/pollRepositorySQLite');

function createPollHandler(sequelize) {
  const router = express.Router();
  const pollRepository = createPollRepository(sequelize);
  const pollController = createPollController(pollRepository);
  router.post('/poll', pollController.postPoll);
  return router;
}

module.exports = createPollHandler;
