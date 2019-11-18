function createPollRepository(sequelize) {
  async function insert(data) {
    const { models } = sequelize;
    const pollRecord = await models.poll.create(data);
    const poll = pollRecord.toJSON();
    return poll;
  }

  return {
    insert,
  };
}

module.exports = createPollRepository;
