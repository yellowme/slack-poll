const express = require('express');

function createPollHandler() {
  const router = express.Router();
  router.post('/poll', postPoll);
  return router;
}

function postPoll(req, res) {
  return res.status(201).json({
    text: req.body.text,
    channel: req.body.channel_id,
    mode: 's',
    owner: req.body.user_id,
  });
}

module.exports = createPollHandler;
