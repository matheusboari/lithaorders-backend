'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('orders', 'origin', {
      type: Sequelize.STRING,
      defaultValue: 'Sem origem',
      allowNull: false,
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('orders', 'origin')
  },
}
