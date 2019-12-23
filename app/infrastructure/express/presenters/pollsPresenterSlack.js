function createPollsPresenterSlack(slack) {
  async function send(message) {
    const response = await slack.chat.postMessage(message);
    return { timestamp: response.ts };
  }

  return {
    send,
  };
}

module.exports = createPollsPresenterSlack;
