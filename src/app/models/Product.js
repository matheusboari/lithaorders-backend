import Sequelize, { Model } from 'sequelize'

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.FLOAT,
        quantity: Sequelize.INTEGER,
        description: Sequelize.TEXT,
      },
      {
        sequelize,
      }
    )

    return this
  }
}

export default Product
