function createPollAnswersRepository(sequelize) {
  const { models } = sequelize;

  async function _find(options) {
    const records = await models.pollAnswer.findAll({
      where: options,
    });

    const plainRecords = records.map(r => r.toJSON());
    return plainRecords.map(pr => ({
      ...pr,
      poll: pr.pollId,
    }));
  }

  async function _insert({ poll: pollId, ...data }) {
    const record = await models.pollAnswer.create({
      ...data,
      pollId,
    });

    const plainRecord = record.toJSON();
    return {
      ...plainRecord,
      poll: plainRecord.pollId,
    };
  }

  return {
    find: jest.fn(_find),
    insert: jest.fn(_insert),
  };
}

module.exports = createPollAnswersRepository;
