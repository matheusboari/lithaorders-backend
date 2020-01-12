import Sequelize, { Model } from 'sequelize'

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.FLOAT,
      },
      {
        sequelize,
      }
    )

    return this
  }

  static associate(models) {
    this.belongsToMany(models.Order, {
      through: models.ProductOrder,
      foreignKey: 'product_id',
      as: 'orders',
    })
    this.belongsTo(models.File, { foreignKey: 'photo_id', as: 'photo' })
  }
}

export default Product
