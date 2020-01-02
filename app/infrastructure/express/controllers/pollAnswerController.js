const NotPollOwnerError = require('../../../core/errors/NotPollOwnerError');
const pollsMessageSerializerSlack = require('../serializers/pollsMessageSerializerSlack');

const PollAnswerController = {
  async update(req, res) {
    const { fetchPoll, fetchPollResponses, createPollResponse } = req.useCases;
    // eslint-disable-next-line camelcase
    const { callback_id, actions, user } = JSON.parse(req.body.payload);
    const [action] = actions;

    try {
      const currentPoll = await fetchPoll({ id: callback_id });

      await createPollResponse(currentPoll, {
        poll: currentPoll.id,
        option: action.value,
        owner: user.id,
      });

      const pollResponses = await fetchPollResponses({ id: callback_id });

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
  },

  async delete(req, res) {
    const { deletePoll } = req.useCases;
    // eslint-disable-next-line camelcase
    const { callback_id, user } = JSON.parse(req.body.payload);

    try {
      await deletePoll({ id: callback_id, owner: user.id });
      return res.status(200).json({
        delete_original: true,
      });
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
  },
};

module.exports = PollAnswerController;
