function createPollRepository(sequelize) {
  const { models } = sequelize;

  async function insert(data) {
    const pollRecord = await models.poll.create(data);
    const poll = pollRecord.toJSON();
    return poll;
  }

  async function update(id, data) {
    await models.poll.update(data, { where: { id } });
    const record = await models.poll.findOne({ where: { id } });
    return record.toJSON();
  }

  return {
    insert,
    update,
  };
}

module.exports = createPollRepository;
