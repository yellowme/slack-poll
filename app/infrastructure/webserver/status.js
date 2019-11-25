const express = require('express');

const createStatusController = require('../../interfaces/controllers/statusController');

// Create handler for /status resource
function createStatusHandler() {
  const router = express.Router();

  // Initialize controller
  const statusController = createStatusController();

  // Attatch route controller
  router.get('/status', statusController.getPing);

  return router;
}

module.exports = createStatusHandler;
