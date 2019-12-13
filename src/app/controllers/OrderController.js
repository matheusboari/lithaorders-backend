import * as Yup from 'yup'

import Order from '../models/Order'
import Product from '../models/Product'
import Client from '../models/Client'
import ProductOrder from '../models/ProductOrder'

class OrderController {
  async index(req, res) {
    const { page = 1 } = req.query

    const orders = await Order.findAll({
      order: ['created_at'],
      limit: 20,
      offset: (page - 1) * 20,
    })

    return res.json(orders)
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      track_number: Yup.string(),
      is_track_number: Yup.boolean(),
      products: Yup.array()
        .of(
          Yup.object().shape({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
            description: Yup.string().required(),
          })
        )
        .required(),
      client_id: Yup.number().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' })
    }

    const { track_number, is_track_number, products, client_id } = req.body

    /**
     * Check products exists
     */
    const productPromise = products.map(async product => {
      const { id, quantity, description } = product
      const productExists = await Product.findByPk(id)

      if (!productExists) {
        return res.status(400).json({ error: 'Product doesnt exists.' })
      }

      return {
        product_id: id,
        name: productExists.name,
        quantity,
        description,
        unit_price: productExists.price,
      }
    })

    const productFormatted = await Promise.all(productPromise)

    /**
     * Check client exists
     */
    const clientExists = await Client.findByPk(client_id)

    if (!clientExists) {
      return res.status(400).json({ error: 'Client doesnt exists.' })
    }

    const order = await Order.create({
      track_number,
      is_track_number,
      client_id,
    })

    /**
     * Create products for order
     */

    productFormatted.map(async product => {
      await ProductOrder.create({
        ...product,
        order_id: order.id,
      })
    })

    return res.json(order)
  }
}

export default new OrderController()
