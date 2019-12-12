const express = require('express');

const createPollAnswerController = require('../../interfaces/controllers/pollAnswerController');

// Create handler for /hook resource
function createPollAnswerHandler({ pollsRepository, pollAnswersRepository }) {
  const router = express.Router();

  // Initialize controller
  const pollAnswerController = createPollAnswerController({
    pollsRepository,
    pollAnswersRepository,
  });

  // Attatch route controller
  router.post('/hook', pollAnswerController.postPollAnswer);
  return router;
}

module.exports = createPollAnswerHandler;
