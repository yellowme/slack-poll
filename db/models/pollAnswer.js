function createPollAnswerModel(sequelize, DataTypes) {
  return sequelize.define("pollAnswers", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    option: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
}

module.exports = createPollAnswerModel;
