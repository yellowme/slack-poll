const express = require('express');

const createPollAnswerController = require('../../interfaces/controllers/pollAnswerController');

// Create handler for /hook resource
function createPollAnswerHandler({ pollAnswersRepository }) {
  const router = express.Router();

  // Initialize controller
  const pollAnswerController = createPollAnswerController({
    pollAnswersRepository,
  });

  // Attatch route controller
  router.post('/hook', pollAnswerController.postPollAnswer);
  return router;
}

module.exports = createPollAnswerHandler;
