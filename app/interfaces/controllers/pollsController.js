const config = require('../../infrastructure/config');

const createCreatePollUseCase = require('../../application/useCase/createPoll');

const pollsMessageSerializerSlack = require('../serializers/pollsMessageSerializerSlack');
const pollsStringSerializer = require('../serializers/pollsStringSerializer');

function createPollsController({ pollsRepository, pollsPresenter }) {
  const postPoll = createPostPoll({ pollsRepository, pollsPresenter });
  return { postPoll };
}

function createPostPoll({ pollsRepository, pollsPresenter }) {
  const createPoll = createCreatePollUseCase(pollsRepository);

  return async function postPoll(req, res) {
    const { text, token, channel_id, user_id } = req.body;
    if (config.SLACK_VERIFICATION_TOKEN !== token) throw new Error();

    const pollInput = pollsStringSerializer(text, user_id);

    try {
      const createdPoll = await createPoll(pollInput);
      await pollsPresenter.send(
        pollsMessageSerializerSlack(createdPoll),
        channel_id
      );
    } catch (err) {
      throw err;
    }

    return res.status(201).send();
  };
}

module.exports = createPollsController;
