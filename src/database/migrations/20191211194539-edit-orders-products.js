'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('orders', 'product_id', {
      type: Sequelize.ARRAY(Sequelize.ENUM),
      references: { model: 'products', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('orders', 'product_id')
  },
}
