const axios = require('axios');

const config = require('../config');

module.exports = function slackApi(url, method, data) {
  return axios({
    method,
    data,
    url: `${config.SLACK_BASE_URL}/${url}`,
    responseType: 'json',
    headers: {
      Authorization: `Bearer ${config.SLACK_ACCESS_TOKEN}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
  }).then(response => response.data);
};
