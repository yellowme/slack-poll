'use strict'

const constants = require('../constants')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'polls',
      'mode',
      {
        defaultValue: constants.pollMode.SINGLE,
        type: Sequelize.ENUM(
          constants.pollMode.SINGLE,
          constants.pollMode.MULTIPLE
        )
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'polls',
      'mode'
    )
  }
}
