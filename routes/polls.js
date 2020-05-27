const express = require('express');
const createError = require('http-errors');
const pollsMessageSerializerSlack = require('../serializers/pollsMessageSerializerSlack');
const parsePollString = require('../app/parsePollString');
const slack = require('../lib/slack');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { createPoll, updatePoll } = req.services;

  // slack slash command body
  // https://api.slack.com/methods/chat.postMessage
  const { text, token, channel_id: channelId, user_id: userId } = req.body;

  // validate verification token
  if (req.config.SLACK_VERIFICATION_TOKEN !== token)
    return next(createError(403, 'invalid verification token'));

  // read poll from slack slash command
  const pollInput = parsePollString({ text, userId });

  try {
    const createdPoll = await createPoll(pollInput);
    const response = await slack.chat.postMessage(
      pollsMessageSerializerSlack(createdPoll, {
        channel: channelId,
      })
    );

    createdPoll.timestamp = response.ts;
    await updatePoll(createdPoll);

    // return empty to prevent re-draw message in slack
    return res.status(201).send();
  } catch (err) {
    return next(createError(500, req));
  }
});

module.exports = router;
