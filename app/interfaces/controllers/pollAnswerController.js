const config = require('../../config');
const createCreatePollResponse = require('../../application/useCase/createPollResponse');
const createFetchPoll = require('../../application/useCase/fetchPoll');
const createFetchPollResponses = require('../../application/useCase/fetchPollResponses');
const createDeletePoll = require('../../application/useCase/deletePoll');
const pollsMessageSerializerSlack = require('../serializers/pollsMessageSerializerSlack');

// Build poll answers controller
function createPollAnswerController({
  pollAnswersRepository,
  pollsRepository,
}) {
  const createPollResponse = createCreatePollResponse(pollAnswersRepository);
  const fetchPoll = createFetchPoll(pollsRepository);
  const fetchPollResponses = createFetchPollResponses(pollAnswersRepository);
  const deletePoll = createDeletePoll(pollsRepository);

  const deletePollHandler = createDeletePollHandler({
    deletePoll,
  });

  const answerPollHandler = createAnswerPollHandler({
    createPollResponse,
    fetchPoll,
    fetchPollResponses,
  });

  const postPollAnswer = createPostPollAnswer({
    deletePollHandler,
    answerPollHandler,
  });

  return { postPollAnswer };
}

// POST /hook
function createPostPollAnswer({ deletePollHandler, answerPollHandler }) {
  async function postPollAnswer(req, res) {
    // Slack interactive action request body
    // https://api.slack.com/reference/interaction-payloads/actions
    const { token, actions } = JSON.parse(req.body.payload);
    const [action] = actions;

    // Validate verification token
    if (config.SLACK_VERIFICATION_TOKEN !== token)
      return res.status(401).send();

    try {
      switch (action.value) {
        case 'cancel-null':
          return deletePollHandler(req, res);
        default:
          return answerPollHandler(req, res);
      }
    } catch (err) {
      return res.status(500).json({
        text: "Sorry, there's been an error. Try again later.",
        replace_original: false,
      });
    }
  }

  return postPollAnswer;
}

function createAnswerPollHandler({
  fetchPoll,
  fetchPollResponses,
  createPollResponse,
}) {
  return async function answerPollHandler(req, res) {
    try {
      const { callback_id, actions, user } = JSON.parse(req.body.payload);
      const [action] = actions;

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
      throw err;
    }
  };
}

function createDeletePollHandler({ deletePoll }) {
  return async function deletePollHandler(req, res) {
    const { callback_id } = JSON.parse(req.body.payload);

    try {
      await deletePoll({ id: callback_id });
    } catch (err) {
      throw err;
    }

    return res.status(200).json({
      text: 'Poll Deleted',
      replace_original: true,
    });
  };
}

module.exports = createPollAnswerController;
