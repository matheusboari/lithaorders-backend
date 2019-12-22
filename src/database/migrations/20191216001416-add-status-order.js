'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('orders', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Open',
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('orders', 'status')
  },
}
