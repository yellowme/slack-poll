function createPollsRepository(sequelize) {
  async function _insert({ options, ...data }) {
    const { models } = sequelize;

    const pollRecord = await models.poll.create({
      ...data,
      options: options.join(','),
    });

    const poll = pollRecord.toJSON();
    return {
      ...poll,
      options: poll.options.split(','),
    };
  }

  return {
    insert: jest.fn(_insert),
  };
}

module.exports = createPollsRepository;
