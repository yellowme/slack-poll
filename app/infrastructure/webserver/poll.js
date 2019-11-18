const express = require('express');

const createPollController = require('../../adapter/pollController');
const createPollRepository = require('../../adapter/pollRepositorySQLite');
const createMessageRepository = require('../../adapter/messageRepositorySlack');

function createPollHandler(sequelize, slack) {
  const router = express.Router();
  const pollRepository = createPollRepository(sequelize);
  const messageRepository = createMessageRepository(slack);

  const pollController = createPollController({
    pollRepository,
    messageRepository,
  });

  router.post('/poll', pollController.postPoll);
  return router;
}

module.exports = createPollHandler;
