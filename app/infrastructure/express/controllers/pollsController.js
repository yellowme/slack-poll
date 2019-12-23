const errorResponses = require('../helpers/errorResponses');
const pollsStringSerializer = require('../serializers/pollsStringSerializer');
const pollsMessageSerializerSlack = require('../serializers/pollsMessageSerializerSlack');

const PollController = {
  async create(req, res) {
    const { createPoll, storePollPresenterTimestamp } = req.useCases;
    const { pollsPresenter } = req.presenters;

    // Slack slash command body
    // https://api.slack.com/methods/chat.postMessage
    // eslint-disable-next-line camelcase
    const { text, token, channel_id, user_id } = req.body;

    // Validate verification token
    if (req.config.SLACK_VERIFICATION_TOKEN !== token)
      return errorResponses.unauthorized(res, {
        message: 'Invalid verification token',
      });

    // Read poll from slack slash command
    const pollInput = pollsStringSerializer({ text, user_id });

    try {
      const createdPoll = await createPoll(pollInput);
      const presenterResponse = await pollsPresenter.send(
        pollsMessageSerializerSlack(createdPoll, {
          channel: channel_id,
        })
      );

      createdPoll.timestamp = presenterResponse.timestamp;
      await storePollPresenterTimestamp(createdPoll);

      // Return empty to prevent draw in slack
      return res.status(201).send();
    } catch (err) {
      return errorResponses.badImplementation(res);
    }
  },
};

module.exports = PollController;
