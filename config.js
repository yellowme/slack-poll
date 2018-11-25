const dotenv = require('dotenv')

dotenv.config({ silent: true })

const {
  PORT = 3000,
  DATABASE_URL,
  SLACK_CLIENT_ID,
  SLACK_CLIENT_SECRET,
  SLACK_SIGNING_SECRET,
  SLACK_VERIFICATION_TOKEN,
  SLACK_ACCESS_TOKEN
} = process.env

const defaults = {
  SLACK_CLIENT_ID: null,
  SLACK_CLIENT_SECRET: null,
  SLACK_SIGNING_SECRET: null,
  SLACK_VERIFICATION_TOKEN: null,
  SLACK_ACCESS_TOKEN: null
}

Object.keys(defaults).forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Please enter a custom ${key} in .env on the root directory`)
  }
})

module.exports = {
  PORT,
  DATABASE_URL,
  SLACK_CLIENT_ID,
  SLACK_CLIENT_SECRET,
  SLACK_SIGNING_SECRET,
  SLACK_VERIFICATION_TOKEN,
  SLACK_ACCESS_TOKEN
}
