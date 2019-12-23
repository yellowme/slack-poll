const express = require('express');

const pollsController = require('../controllers/pollsController');

function createPollsHandler() {
  const router = express.Router();

  // Attatch route controller
  router.post('/polls', pollsController.create);
  return router;
}

module.exports = createPollsHandler;
