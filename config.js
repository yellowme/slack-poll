const dotenv = require('dotenv')

dotenv.config({ silent: true })

const {
  PORT = 3000,
  SLACK_BASE_URL = 'https://slack.com/api',
  DATABASE_URL,
  SLACK_VERIFICATION_TOKEN,
  SLACK_ACCESS_TOKEN
} = process.env

const defaults = {
  SLACK_VERIFICATION_TOKEN: null,
  SLACK_ACCESS_TOKEN: null
}

// Alert to fill the necessary environment variables
Object.keys(defaults).forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Please enter a custom ${key} in .env on the root directory`)
  }
})

module.exports = {
  PORT,
  SLACK_BASE_URL,
  DATABASE_URL,
  SLACK_VERIFICATION_TOKEN,
  SLACK_ACCESS_TOKEN
}
