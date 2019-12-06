function createPollAnswersRepository(sequelize) {
  const { models } = sequelize;

  async function _insert({ poll: pollId, ...data }) {
    const record = await models.pollAnswer.create({
      ...data,
      pollId,
    });

    return record.toJSON();
  }

  return {
    insert: jest.fn(_insert),
  };
}

module.exports = createPollAnswersRepository;
