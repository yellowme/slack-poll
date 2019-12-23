const PollAnswerController = require('./pollAnswerController');
const errorResponses = require('../helpers/errorResponses');

// Hook controler proxies PollAnswer Controller
const HookController = {
  create(req, res) {
    // Slack interactive action request body
    // https://api.slack.com/reference/interaction-payloads/actions
    const { token, actions } = JSON.parse(req.body.payload);
    const [action] = actions;

    // Validate verification token
    if (req.config.SLACK_VERIFICATION_TOKEN !== token)
      return errorResponses.unauthorized(res, {
        message: 'Invalid verification token',
      });

    switch (action.value) {
      case 'cancel-null':
        return PollAnswerController.delete(req, res);
      default:
        return PollAnswerController.update(req, res);
    }
  },
};

module.exports = HookController;
