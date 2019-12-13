function createPollRepository(sequelize) {
  const { models } = sequelize;

  async function _find(pollData = {}) {
    const pollRecords = await models.poll.findAll({
      where: pollRecordInputSerializer(pollData),
    });

    const polls = pollRecords.map(pollRecordOutupSerializer);
    return polls;
  }

  async function _insert(pollData) {
    const record = await models.poll.create(
      pollRecordInputSerializer(pollData)
    );

    return pollRecordOutupSerializer(record);
  }

  async function _update(pollData) {
    const { id, ...pollUpdate } = pollRecordInputSerializer(pollData);
    await models.poll.update(pollUpdate, { where: { id } });
    const record = await models.poll.findOne({ where: { id } });
    return pollRecordOutupSerializer(record);
  }

  async function _destroy(poll) {
    const plainPoll = pollRecordInputSerializer(poll);

    const record = await models.poll.findOne({
      where: plainPoll,
    });

    await models.poll.destroy({
      where: plainPoll,
    });

    return pollRecordOutupSerializer(record);
  }

  return {
    find: jest.fn(_find),
    insert: jest.fn(_insert),
    update: jest.fn(_update),
    destroy: jest.fn(_destroy),
  };
}

function pollRecordOutupSerializer(pollRecord) {
  const plainPollRecord = pollRecord.toJSON();
  if (plainPollRecord.options)
    plainPollRecord.options = plainPollRecord.options.split(',');
  return plainPollRecord;
}

function pollRecordInputSerializer({ options, ...poll }) {
  const plainPollRecord = poll;
  // SQL does not support array, so it's converted to string
  if (options) plainPollRecord.options = options.join(',');
  return plainPollRecord;
}

module.exports = createPollRepository;
