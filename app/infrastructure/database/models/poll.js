function createPollModel(sequelize, DataTypes) {
  return sequelize.define('poll', {
    text: {
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
    mode: {
      type: DataTypes.ENUM('s', 'm'),
      defaultValue: 's',
    },
  });
}

module.exports = createPollModel;
