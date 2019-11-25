function createPollsPresenterSlack(slack) {
  async function send(message) {
    const slackResponse = await slack.chatPostMessage(message);
    return { timestamp: slackResponse.ts };
  }

  return {
    send,
  };
}

module.exports = createPollsPresenterSlack;
