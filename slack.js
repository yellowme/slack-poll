const fetch = require('node-fetch')
const config = require('./config')

function sendPollMessage (body) {
  return fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.SLACK_ACCESS_TOKEN}`,
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(body)
  }).then(response => response.json())
}

function updatePollMessage (body) {
  return fetch('https://slack.com/api/chat.update', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.SLACK_ACCESS_TOKEN}`,
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(body)
  }).then(response => response.json())
}

function deletePollMessage (body) {
  return fetch('https://slack.com/api/chat.delete', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.SLACK_ACCESS_TOKEN}`,
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(body)
  }).then(response => response.json())
}

module.exports = {
  sendPollMessage,
  updatePollMessage,
  deletePollMessage
}
