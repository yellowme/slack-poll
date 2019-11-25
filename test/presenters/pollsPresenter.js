const slack = require('../slack');

function createPollsPresenterSlack() {
  async function _send(message) {
    slack.chatPostMessage(message);
    return { timestamp: Date.now() };
  }

  return {
    send: jest.fn(_send),
  };
}

module.exports = createPollsPresenterSlack;
