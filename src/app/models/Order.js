import Sequelize, { Model } from 'sequelize'
import { format } from 'date-fns'
import pt from 'date-fns/locale/pt'

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        post_date: Sequelize.DATE,
        formattedDate: {
          type: Sequelize.VIRTUAL,
          get() {
            return format(this.post_date, "dd 'de' MMMM", {
              locale: pt,
            })
          },
        },
        quantity_total: Sequelize.INTEGER,
        status: Sequelize.STRING,
        origin: Sequelize.STRING,
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
    this.belongsToMany(models.Product, {
      through: models.ProductOrder,
      foreignKey: 'order_id',
      as: 'products',
    })
    this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' })
    this.belongsTo(models.File, { foreignKey: 'photo_id', as: 'photo' })
  }
}

export default Order
