const slackApi = require('./client');

function chatPostMessage(data) {
  return slackApi('chat.postMessage', 'POST', data);
}

module.exports = chatPostMessage;
