const faker = require('faker');
const Poll = require('../../app/core/entities/poll');

module.exports = function createPoll(overrides) {
  return Poll({
    id: faker.random.uuid(),
    options: [faker.lorem.word(), faker.lorem.word()],
    owner: faker.random.uuid(),
    question: faker.lorem.word(),
    ...overrides,
  });
};
