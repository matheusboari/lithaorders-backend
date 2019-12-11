'use strict'

module.exports = {
  up: queryInterface => {
    return queryInterface.removeColumn('orders', 'post_date')
  },

  down: queryInterface => {
    return queryInterface.removeColumn('orders', 'post_date')
  },
}
