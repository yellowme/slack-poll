function createPollModel(sequelize, DataTypes) {
  return sequelize.define('poll', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    options: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.STRING,
    },
    mode: {
      type: DataTypes.ENUM('s', 'm'),
      defaultValue: 's',
    },
  });
}

module.exports = createPollModel;
