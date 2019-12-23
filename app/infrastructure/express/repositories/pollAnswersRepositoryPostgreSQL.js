function pollAnswerRecordOutupSerializer(pollAnswerRecord) {
  const { pollId, ...plainPollAnswerRecord } = pollAnswerRecord.toJSON();
  if (pollId) plainPollAnswerRecord.poll = pollId;
  return plainPollAnswerRecord;
}

function pollAnswerRecordInputSerializer({ poll, ...pollAnswer }) {
  const plainPollRecord = pollAnswer;
  if (poll) plainPollRecord.pollId = poll;
  return plainPollRecord;
}

function createPollRepository(sequelize) {
  const { models } = sequelize;

  async function find(pollAnswerData = {}) {
    const pollAnswerRecords = await models.pollAnswer.findAll({
      where: pollAnswerRecordInputSerializer(pollAnswerData),
    });

    const pollAnswer = pollAnswerRecords.map(pollAnswerRecordOutupSerializer);
    return pollAnswer;
  }

  async function insert(pollData) {
    const pollAnswerRecord = await models.pollAnswer.create(
      pollAnswerRecordInputSerializer(pollData)
    );

    return pollAnswerRecordOutupSerializer(pollAnswerRecord);
  }

  async function update(pollAnswerData) {
    const { id, ...pollUpdate } = pollAnswerRecordInputSerializer(
      pollAnswerData
    );

    await models.pollAnswer.update(pollUpdate, { where: { id } });
    const record = await models.pollAnswer.findOne({ where: { id } });
    return pollAnswerRecordOutupSerializer(record);
  }

  async function destroy(pollAnswerData) {
    const plainPollAnswerRecord = pollAnswerRecordInputSerializer(
      pollAnswerData
    );

    const record = await models.pollAnswer.findOne({
      where: plainPollAnswerRecord,
    });

    await models.pollAnswer.destroy({
      where: plainPollAnswerRecord,
    });

    return pollAnswerRecordOutupSerializer(record);
  }

  return {
    find,
    insert,
    update,
    destroy,
  };
}

module.exports = createPollRepository;
