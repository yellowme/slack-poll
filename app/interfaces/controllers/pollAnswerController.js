const config = require('../../config');

const createCreatePollResponseUseCase = require('../../application/useCase/createPollResponse');

// Build poll answers controller
function createPollAnswerController({ pollAnswersRepository, pollsPresenter }) {
  const createPollResponse = createCreatePollResponseUseCase(
    pollAnswersRepository
  );

  const postPollAnswer = createPostPollAnswer({
    createPollResponse,
  });

  return { postPollAnswer };
}

// POST /hook
function createPostPollAnswer({ createPollResponse }) {
  async function postPollAnswer(req, res) {
    // Slack interactive action request body
    // https://api.slack.com/reference/interaction-payloads/actions
    const payload = JSON.parse(req.body.payload);
    const { token, user, callback_id, actions } = payload;
    const [action] = actions;

    // Validate verification token
    if (config.SLACK_VERIFICATION_TOKEN !== token) throw new Error();

    try {
      const createdPollAnswer = await createPollResponse({
        poll: callback_id,
        option: action.value,
        owner: user.id,
      });

      /**
      const presenterResponse = await pollsPresenter.send(
        pollsMessageSerializerSlack(createdPoll, {
          channel: channel_id,
        })
      );
       */
    } catch (err) {
      console.log({ err });
      return res.status(500).send(err);
    }

    // Return empty to prevent draw in slack
    return res.status(201).send();
  }

  return postPollAnswer;
}

module.exports = createPollAnswerController;
