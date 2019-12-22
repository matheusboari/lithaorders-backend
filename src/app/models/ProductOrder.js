import Sequelize, { Model } from 'sequelize'

class ProductOrder extends Model {
  static init(sequelize) {
    super.init(
      {
        quantity: Sequelize.INTEGER,
        total: Sequelize.FLOAT,
        description: Sequelize.STRING,
      },
      {
        sequelize,
      }
    )

    return this
  }
}

export default ProductOrder
