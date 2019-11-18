const createCreatePollUseCase = require('../usecase/createPoll');
const createCreateMessageUseCase = require('../usecase/createMessage');

const pollSerializerHTTP = require('./pollSerializerHTTP');

function createPollController({ pollRepository, messageRepository }) {
  const createPoll = createCreatePollUseCase({
    pollRepository,
  });

  const createMessage = createCreateMessageUseCase({
    messageRepository,
  });

  async function postPoll(req, res) {
    const pollData = pollSerializerHTTP.serialize(req.body);

    try {
      const message = await createMessage({ ...pollData, ...req.body });
      pollData.timestamp = message.ts;
      await createPoll(pollData);
    } catch (err) {
      throw err;
    }

    return res.status(201).send();
  }

  return {
    postPoll,
  };
}

module.exports = createPollController;
