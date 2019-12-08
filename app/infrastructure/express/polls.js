const express = require('express');

const createPollsController = require('../../interfaces/controllers/pollsController');

// Create handler for /polls resource
function createPollsHandler({ pollsRepository, pollsPresenter }) {
  const router = express.Router();

  // Initialize controller
  const pollsController = createPollsController({
    pollsRepository,
    pollsPresenter,
  });

  // Attatch route controller
  router.post('/polls', pollsController.postPoll);
  return router;
}

module.exports = createPollsHandler;
