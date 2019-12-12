const config = require('../../config');

const createCreatePollUseCase = require('../../application/useCase/createPoll');
const createStorePollPresenterTimestampUseCase = require('../../application/useCase/storePollPresenterTimestamp');
const pollsMessageSerializerSlack = require('../serializers/pollsMessageSerializerSlack');
const pollsStringSerializer = require('../serializers/pollsStringSerializer');

// Build polls controller
function createPollsController({ pollsRepository, pollsPresenter }) {
  const createPoll = createCreatePollUseCase(pollsRepository);
  const storePollPresenterTimestamp = createStorePollPresenterTimestampUseCase(
    pollsRepository
  );

  const postPoll = createPostPoll({
    createPoll,
    storePollPresenterTimestamp,
    pollsPresenter,
  });

  return { postPoll };
}

// POST /poll
function createPostPoll({
  createPoll,
  storePollPresenterTimestamp,
  pollsPresenter,
}) {
  async function postPoll(req, res) {
    // Slack slash command body
    // https://api.slack.com/methods/chat.postMessage
    const { text, token, channel_id, user_id } = req.body;

    // Validate verification token
    if (config.SLACK_VERIFICATION_TOKEN !== token) throw new Error();

    // Read poll from slack slash command
    const pollInput = pollsStringSerializer({ text, user_id });

    try {
      const createdPoll = await createPoll(pollInput);
      const presenterResponse = await pollsPresenter.send(
        pollsMessageSerializerSlack(createdPoll, {
          channel: channel_id,
        })
      );

      await storePollPresenterTimestamp(
        createdPoll.id,
        presenterResponse.timestamp
      );
    } catch (err) {
      return res.status(500).send(err);
    }

    // Return empty to prevent draw in slack
    return res.status(201).send();
  }

  return postPoll;
}

module.exports = createPollsController;
