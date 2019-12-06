function createPollAnswerModel(sequelize, DataTypes) {
  return sequelize.define('pollAnswer', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    option: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
}

module.exports = createPollAnswerModel;
