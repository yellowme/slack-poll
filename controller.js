const config = require('./config');
const formatters = require('./formatters');
const models = require('./models');
const api = require('./api');
const utils = require('./utils');

const { Poll, sequelize } = models;

/**
 * POST /poll
 * Capture the slash command an publish message to slack
 */
async function pollPost(req, res) {
  // Need to validate header signature wtih slack token
  if (!req.body || req.body.token !== config.SLACK_VERIFICATION_TOKEN) {
    return res
      .status(403)
      .json({ errors: ['Request is not signed correctly!'] });
  }

  const pollData = utils.parsePollData(req.body.text);

  return sequelize.transaction(async transaction => {
    const createdPoll = await Poll.create(
      {
        text: req.body.text,
        owner: req.body.user_id,
        channel: req.body.channel_id,
        mode: pollData.mode,
      },
      {
        transaction,
      }
    );

    try {
      const postMessageResponse = await api.publishPoll(
        req.body.channel_id,
        createdPoll,
        pollData
      );

      await Poll.update(
        {
          // The response message returns only the TS from the title message block
          titleTs: postMessageResponse.ts,
        },
        {
          where: {
            id: createdPoll.id,
          },
        }
      );

      return res.status(201).send();
    } catch (err) {
      transaction.rollback();
      return res.status(403).send();
    }
  });
}

/**
 * POST /hook
 * Capture response to poll and update slack message
 */
async function hookPost(req, res) {
  if (!req.body) return res.status(400).send('Empty body');
  const body = JSON.parse(req.body.payload);

  // Need to validate header signature wtih slack token
  if (body.token !== config.SLACK_VERIFICATION_TOKEN) {
    return res.status(403).send('Request is not signed correctly!');
  }

  // https://api.slack.com/docs/interactive-message-field-guide
  if (body.type !== 'interactive_message') return res.status(201).send();
  const currentPollInstance = await Poll.findById(body.callback_id);
  const currentPoll = await currentPollInstance.get({ plain: true });

  if (!currentPoll) throw new Error('Unexisting poll!');

  // Delete poll by request (only if owner)
  // Body actions can be obtained in incoming-webhooks docs
  // https://api.slack.com/incoming-webhooks
  if (body.actions[0].value === 'cancel-null') {
    if (currentPoll.owner !== body.user.id) return res.status(204).send();
    await api.deletePoll(currentPoll);
    return res.status(201).send();
  }

  return sequelize.transaction(async transaction => {
    try {
      await api.addAnswerToPoll(
        currentPoll,
        {
          answer: body.actions[0].value,
          userId: body.user.id,
          username: body.user.name,
        },
        transaction
      );

      // Regenerates poll message with updated answers
      const pollData = utils.parsePollData(currentPoll.text);
      const currentPollAnswers = await api.readPollAnswers(currentPoll);
      const pollOptions = formatters.reducePollEnhancedOptionsString(
        pollData.messageItems,
        currentPollAnswers,
        pollData.emojis
      );

      return api.updatePollWithAnswers(body.channel.id, currentPoll, {
        ...pollData,
        options: pollOptions,
      });
    } catch (err) {
      transaction.rollback();
      return res.status(403).send();
    }
  });
}

module.exports = {
  pollPost,
  hookPost,
};
