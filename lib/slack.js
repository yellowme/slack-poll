const { WebClient } = require('@slack/web-api');

const config = require('../config');

module.exports = new WebClient(config.SLACK_ACCESS_TOKEN);
