/* global describe, test, beforeEach, afterEach, expect */
require('dotenv').config()

const moxios = require('moxios')
const request = require('supertest')

const app = require('../index')

const config = require('../config')

describe('POST /poll', () => {
  beforeEach(() => moxios.install())
  afterEach(() => moxios.uninstall())
  test('It should create a poll', async () => {
    const text = '“What’s your favorite color?” “One” “Two” “Tree”'
    const baseUrl = `${config.SLACK_BASE_URL}/chat.postMessage`

    moxios.stubRequest(baseUrl, {
      status: 201,
      response: {}
    })

    await request(app)
      .post('/poll')
      .send({
        text,
        owner: 'O1',
        channel: 'C1',
        token: config.SLACK_VERIFICATION_TOKEN
      })
      .expect(201)

    expect(moxios.requests.mostRecent().url).toBe(baseUrl)
  })
})
