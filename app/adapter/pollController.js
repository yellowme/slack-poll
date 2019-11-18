const createCreatePollUseCase = require('../usecase/createPoll');

const pollSerializerHTTP = require('./pollSerializerHTTP');

function createPollController(pollRepository) {
  const createPoll = createCreatePollUseCase(pollRepository);

  async function postPoll(req, res) {
    const { text, channel_id: channel, user_id: owner } = req.body;

    const createdPoll = await createPoll({
      text,
      channel,
      owner,
    });

    const poll = pollSerializerHTTP.serialize(createdPoll);
    return res.status(201).json(poll);
  }

  return {
    postPoll,
  };
}

module.exports = createPollController;
