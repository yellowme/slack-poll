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
  const PollAnswer = sequelize.models.poll_answer;

  async function find(pollAnswerData = {}) {
    const pollAnswerRecords = await PollAnswer.findAll({
      where: pollAnswerRecordInputSerializer(pollAnswerData),
    });

    const pollAnswer = pollAnswerRecords.map(pollAnswerRecordOutupSerializer);
    return pollAnswer;
  }

  async function insert(pollData) {
    const pollAnswerRecord = await PollAnswer.create(
      pollAnswerRecordInputSerializer(pollData)
    );

    return pollAnswerRecordOutupSerializer(pollAnswerRecord);
  }

  async function update(pollAnswerData) {
    const { id, ...pollUpdate } = pollAnswerRecordInputSerializer(
      pollAnswerData
    );

    await PollAnswer.update(pollUpdate, { where: { id } });
    const record = await PollAnswer.findOne({ where: { id } });
    return pollAnswerRecordOutupSerializer(record);
  }

  async function destroy({ id }) {
    const record = await PollAnswer.findOne({
      where: { id },
    });

    await PollAnswer.destroy({
      where: { id },
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
