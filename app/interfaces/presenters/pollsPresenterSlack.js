function createPollsPresenterSlack(slack) {
  async function send(message) {
    slack.chatPostMessage(message);
  }

  return {
    send,
  };
}

module.exports = createPollsPresenterSlack;
