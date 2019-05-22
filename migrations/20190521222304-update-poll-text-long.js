module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('polls', 'text', {
      type: Sequelize.TEXT('long'),
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('polls', 'text', {
      type: Sequelize.STRING,
    });
  },
};
