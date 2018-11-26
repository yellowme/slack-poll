const fetch = require('node-fetch')
const config = require('./config')

module.exports = function slackApi (url, method, body) {
  return fetch(`${config.SLACK_BASE_URL}/${url}`, {
    method,
    headers: {
      'Authorization': `Bearer ${config.SLACK_ACCESS_TOKEN}`,
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(body)
  }).then(response => response.json())
}
