const dotenv = require('dotenv');

dotenv.config({ silent: true });

const {
  PORT = 3000,
  SLACK_BASE_URL = 'https://slack.com/api',
  DATABASE_URL,
  SLACK_VERIFICATION_TOKEN,
  SLACK_ACCESS_TOKEN,
  NODE_ENV,
  SLACK_APP_DISPLAY_NAME = 'Yellow Poll',
  SLACK_MESSAGE_BAR_COLOR = '#ffd100',
} = process.env;

const defaults = {
  SLACK_VERIFICATION_TOKEN: null,
  SLACK_ACCESS_TOKEN: null,
};

function verifyEnv(defaultEnv, currentEnv) {
  // Alert to fill the necessary environment variables
  Object.keys(defaultEnv).forEach(key => {
    if (!currentEnv[key]) {
      throw new Error(
        `Please enter a custom ${key} in .env on the root directory`
      );
    }
  });
}

verifyEnv(defaults, process.env);

module.exports = {
  _verifyEnv: verifyEnv,
  PORT,
  SLACK_BASE_URL,
  DATABASE_URL,
  SLACK_VERIFICATION_TOKEN,
  SLACK_ACCESS_TOKEN,
  NODE_ENV,
  SLACK_APP_DISPLAY_NAME,
  SLACK_MESSAGE_BAR_COLOR,
};
