const express = require('express');

const pingController = require('../../adapter/pingController');

function createPingHandler() {
  const router = express.Router();
  router.get('/ping', pingController.getPing);
  return router;
}

module.exports = createPingHandler;
