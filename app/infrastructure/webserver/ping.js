const express = require('express');

function createPingHandler() {
  const router = express.Router();
  router.get('/ping', getPing);
  return router;
}

function getPing(_, res) {
  return res.json({ on: true });
}

module.exports = createPingHandler;
