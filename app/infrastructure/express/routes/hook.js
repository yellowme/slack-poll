const express = require('express');

const hookController = require('../controllers/hookController');

function createPollAnswerHandler() {
  const router = express.Router();

  router.post('/hook', hookController.create);
  return router;
}

module.exports = createPollAnswerHandler;
