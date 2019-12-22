'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('orders', 'quantity_total', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('orders', 'quantity_total')
  },
}
