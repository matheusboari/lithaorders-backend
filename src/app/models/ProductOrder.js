import Sequelize, { Model } from 'sequelize'

class ProductOrder extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        unit_price: Sequelize.FLOAT,
        total: {
          type: Sequelize.FLOAT,
          get() {
            return this.quantity * this.unit_price
          },
        },
        quantity: Sequelize.INTEGER,
        description: Sequelize.TEXT,
      },
      {
        sequelize,
      }
    )

    return this
  }

  static associate(models) {
    this.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' })
    this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' })
  }
}

export default ProductOrder
