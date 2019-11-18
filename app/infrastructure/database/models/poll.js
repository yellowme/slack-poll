function createPollModel(sequelize, DataTypes) {
  return sequelize.define('poll', {
    text: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    options: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    channel: {
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
