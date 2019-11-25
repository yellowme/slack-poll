function createPollRepository(sequelize) {
  const { models } = sequelize;

  async function _insert({ options = [], ...data }) {
    // SQL does not support array, so it's converted to string
    const record = await models.poll.create({
      ...data,
      options: options.join(','),
    });

    const plainRecord = record.toJSON();

    // And converted back to array
    return {
      ...plainRecord,
      options: plainRecord.options.split(','),
    };
  }

  async function _update(id, { options, ...data }) {
    if (options) {
      options = options.join(',');
      data.options = options;
    }

    await models.poll.update(data, { where: { id } });
    const record = await models.poll.findOne({ where: { id } });
    return record.toJSON();
  }

  return {
    insert: jest.fn(_insert),
    update: jest.fn(_update),
  };
}

module.exports = createPollRepository;
