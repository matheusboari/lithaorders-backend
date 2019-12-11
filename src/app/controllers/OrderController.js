import * as Yup from 'yup'

import Order from '../models/Order'
import Product from '../models/Product'
import Client from '../models/Client'

class OrderController {
  async index(req, res) {
    const { page = 1 } = req.query

    const orders = await Order.findAll({
      order: ['post_date'],
      limit: 20,
      offset: (page - 1) * 20,
    })

    return res.json(orders)
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      post_date: Yup.date().required(),
      track_number: Yup.string(),
      is_track_number: Yup.boolean(),
      product_id: Yup.array().required(),
      client_id: Yup.number().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' })
    }

    const { track_number, is_track_number, product_id, client_id } = req.body

    /**
     * Check products exists
     */
    product_id.forEarch(async product => {
      const productExists = await Product.findByPk(product)

      if (!productExists) {
        return res.status(400).json({ error: 'Product doesnt exists.' })
      }
    })

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
      product_id,
      client_id,
    })

    return res.json(order)
  }
}

export default new OrderController()
