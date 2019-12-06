function createPollRepository(sequelize) {
  const { models } = sequelize;

  async function find(options) {
    const pollAnswerRecords = await models.pollAnswer.finAll({
      where: options,
    });

    const pollAnswer = pollAnswerRecords.map(pollRecord => pollRecord.toJSON());
    return pollAnswer.map(pr => ({ ...pr, poll: pr.pollId }));
  }

  async function insert(data) {
    const pollRecord = await models.pollAnswer.create(data);
    const poll = pollRecord.toJSON();
    return poll;
  }

  async function update(id, data) {
    await models.pollAnswer.update(data, { where: { id } });
    const record = await models.pollAnswer.findOne({ where: { id } });
    return record.toJSON();
  }

  return {
    find,
    insert,
    update,
  };
}

module.exports = createPollRepository;
