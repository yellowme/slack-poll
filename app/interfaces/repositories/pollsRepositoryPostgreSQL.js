function createPollRepository(sequelize) {
  const { models } = sequelize;

  async function find(pollData = {}) {
    const pollRecords = await models.poll.findAll({ where: pollData });
    const polls = pollRecords.map(pollRecordOutupSerializer);
    return polls;
  }

  async function insert(pollData) {
    const pollRecord = await models.poll.create(pollData);
    return pollRecordOutupSerializer(pollRecord);
  }

  async function update({ id, ...pollData }) {
    await models.poll.update(pollData, { where: { id } });
    const record = await models.poll.findOne({ where: { id } });
    return pollRecordOutupSerializer(record);
  }

  async function destroy(poll) {
    const record = await models.poll.findOne({
      where: poll,
    });

    await models.pollAnswer.destroy({
      where: poll,
    });

    return pollRecordOutupSerializer(record);
  }

  return {
    find,
    insert,
    update,
    destroy,
  };
}

function pollRecordOutupSerializer(pollRecord) {
  const plainPollRecord = pollRecord.toJSON();
  return plainPollRecord;
}

module.exports = createPollRepository;
