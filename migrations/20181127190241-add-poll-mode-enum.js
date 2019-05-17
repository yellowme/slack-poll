const constants = require('../constants');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .describeTable('polls')
      .then(tableDefinition => {
        if (!tableDefinition || tableDefinition.mode) return Promise.resolve();

        return queryInterface.addColumn('polls', 'mode', {
          defaultValue: constants.pollMode.SINGLE,
          type: Sequelize.ENUM(
            constants.pollMode.SINGLE,
            constants.pollMode.MULTIPLE
          ),
        });
      })
      .catch(() => Promise.resolve());
  },

  down: queryInterface => {
    return queryInterface.removeColumn('polls', 'mode');
  },
};
