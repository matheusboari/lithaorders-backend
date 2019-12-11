import Sequelize, { Model } from 'sequelize'
import { addDays } from 'date-fns'

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        post_date: {
          type: Sequelize.VIRTUAL,
          get() {
            return addDays(new Date(), 3)
          },
        },
        track_number: Sequelize.STRING,
        is_track_number: Sequelize.BOOLEAN,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    )

    return this
  }

  static associate(models) {
    this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' })
    this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' })
  }
}

export default Order
