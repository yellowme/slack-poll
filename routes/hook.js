const express = require('express');
const createError = require('http-errors');
const NotPollOwnerError = require('../app/NotPollOwnerError');
const pollsMessageSerializerSlack = require('../serializers/pollsMessageSerializerSlack');
const InvalidPollOptionError = require('../app/InvalidPollError');

const router = express.Router();

async function handlePollAnswerDelete(req, res) {
  const { deletePoll } = req.services;
  const { callback_id: callbackId, user } = JSON.parse(req.body.payload);

  try {
    await deletePoll({ id: callbackId, owner: user.id });
    return res.status(200).json({ delete_original: true });
  } catch (err) {
    const responseJson = {
      response_type: 'ephemeral',
      text: "Sorry, there's been an error. Try again later.",
      replace_original: false,
    };

    if (err instanceof NotPollOwnerError) {
      responseJson.text = err.message;
    }

    return res.status(200).json(responseJson);
  }
}

async function handlePollAnswerUpdate(req, res) {
  const { fetchPoll, fetchPollAnswers, createPollAnswer } = req.services;
  const jsonPayload = JSON.parse(req.body.payload);
  const { callback_id: callbackId, actions, user } = jsonPayload;
  const [action] = actions;

  try {
    const currentPoll = await fetchPoll({ id: callbackId });

    // slack returns option value in the next format "optionValue-index"
    if (!currentPoll.options.some((o, i) => `${o}-${i}` === action.value))
      throw new InvalidPollOptionError(action.value);

    await createPollAnswer(currentPoll, {
      poll: currentPoll.id,
      option: action.value,
      owner: user.id,
    });

    const pollResponses = await fetchPollAnswers({ id: callbackId });

    return res
      .status(201)
      .json(
        pollsMessageSerializerSlack(currentPoll, { responses: pollResponses })
      );
  } catch (err) {
    return res.status(200).json({
      response_type: 'ephemeral',
      text: "Sorry, there's been an error. Try again later.",
      replace_original: false,
    });
  }
}

router.post('/', (req, res, next) => {
  // slack interactive action request body
  // https://api.slack.com/reference/interaction-payloads/actions
  const { token, actions } = JSON.parse(req.body.payload);
  const [action] = actions;

  // Validate verification token
  if (req.config.SLACK_VERIFICATION_TOKEN !== token)
    return next(createError(403, 'invalid verification token'));

  switch (action.value) {
    case 'cancel-null':
      return handlePollAnswerDelete(req, res);
    default:
      return handlePollAnswerUpdate(req, res);
  }
});

module.exports = router;
