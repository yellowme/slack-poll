const slackApi = require('../client');

async function chatPostMessage(data) {
  const reponse = await slackApi('chat.postMessage', 'POST', data);
  if (!reponse.data.ok) throw new Error(reponse.data.ok);
  return reponse.data;
}

module.exports = chatPostMessage;
