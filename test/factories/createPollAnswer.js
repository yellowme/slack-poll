const faker = require('faker');
const PollAnswer = require('../../app/core/entities/pollAnswer');

module.exports = function createPollAnswer(overrides) {
  return PollAnswer({
    id: faker.random.uuid(),
    option: faker.lorem.word(),
    owner: faker.random.uuid(),
    ...overrides,
  });
};
