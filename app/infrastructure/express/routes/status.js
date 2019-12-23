const express = require('express');

const statusController = require('../controllers/statusController');

// Create handler for /status resource
function createStatusHandler() {
  const router = express.Router();

  router.get('/status', statusController.index);
  return router;
}

module.exports = createStatusHandler;
