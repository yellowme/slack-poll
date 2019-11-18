function createPollRepository(sequelize) {
  async function insert({ options, ...data }) {
    const { models } = sequelize;
    const pollRecord = await models.poll.create({
      ...data,
      options: options.join(','),
    });
    const poll = pollRecord.toJSON();
    return poll;
  }

  return {
    insert,
  };
}

module.exports = createPollRepository;
