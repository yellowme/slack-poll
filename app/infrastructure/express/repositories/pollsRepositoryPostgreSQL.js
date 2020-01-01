function pollRecordOutupSerializer(pollRecord) {
  const plainPollRecord = pollRecord.toJSON();
  return plainPollRecord;
}

function createPollRepository(sequelize) {
  const Poll = sequelize.models.poll;

  async function find(pollData = {}) {
    const pollRecords = await Poll.findAll({ where: pollData });
    const polls = pollRecords.map(pollRecordOutupSerializer);
    return polls;
  }

  async function insert(pollData) {
    const pollRecord = await Poll.create(pollData);
    return pollRecordOutupSerializer(pollRecord);
  }

  async function update({ id, ...pollData }) {
    await Poll.update(pollData, { where: { id } });
    const record = await Poll.findOne({ where: { id } });
    return pollRecordOutupSerializer(record);
  }

  async function destroy({ id }) {
    const record = await Poll.findOne({
      where: { id },
    });

    await Poll.destroy({
      where: { id },
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

module.exports = createPollRepository;
