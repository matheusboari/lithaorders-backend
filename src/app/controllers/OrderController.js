import { Op } from 'sequelize'
import * as Yup from 'yup'
import { addDays } from 'date-fns'

import Order from '../models/Order'
import Product from '../models/Product'
import Client from '../models/Client'

class OrderController {
  async index(req, res) {
    const { page = 1, status = '', client = '' } = req.query

    const clients = await Client.findAll({
      attributes: ['id'],
      where: {
        name: {
          [Op.iLike]: `%${client}%`,
        },
      },
    })

    const clientsId = clients.map(client => client.id)

    const orders = await Order.findAll({
      limit: 10,
      offset: (page - 1) * 10,
      attributes: [
        'id',
        'track_number',
        'is_track_number',
        'post_date',
        'formattedDate',
        'quantity_total',
        'status',
        'origin',
      ],
      include: [
        {
          model: Product,
          as: 'products',
          required: false,
          attributes: ['id', 'name'],
          through: {
            as: 'details',
            attributes: ['quantity', 'total', 'description'],
          },
        },
        {
          model: Client,
          as: 'client',
          attributes: ['name'],
        },
      ],
      where: {
        status: {
          [Op.iLike]: `%${status}%`,
        },
        client_id: {
          [Op.in]: clientsId,
        },
      },
    })

    const count = await Order.count({
      where: {
        status: {
          [Op.iLike]: `%${status}%`,
        },
        client_id: {
          [Op.in]: clientsId,
        },
      },
    })

    return res.json({
      count,
      orders,
    })
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      trackNumber: Yup.string(),
      isTrackNumber: Yup.boolean(),
      products: Yup.array()
        .of(
          Yup.object().shape({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
            description: Yup.string(),
          })
        )
        .required(),
      client_id: Yup.number().required(),
      workDays: Yup.number().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' })
    }

    const {
      trackNumber,
      isTrackNumber,
      products,
      client_id,
      origin,
      status,
      workDays,
    } = req.body
    let quantity_total = 0

    /**
     * Check products exists
     */
    const productsPromise = products.map(async product => {
      const { id, quantity, description } = product
      const productExists = await Product.findByPk(id)

      quantity_total += quantity

      if (!productExists) {
        return res.status(400).json({ error: 'Product doesnt exists.' })
      }

      return {
        id,
        quantity,
        description,
        total: quantity * productExists.price,
      }
      // return id
    })

    const productFormatted = await Promise.all(productsPromise)

    /**
     * Check client exists
     */
    const clientExists = await Client.findByPk(client_id)

    if (!clientExists) {
      return res.status(400).json({ error: 'Client doesnt exists.' })
    }

    const order = await Order.create({
      track_number: trackNumber,
      is_track_number: isTrackNumber,
      client_id,
      quantity_total,
      status,
      origin,
      post_date: addDays(new Date(), workDays),
    })

    /**
     * Create products for order
     */

    productFormatted.map(async product => {
      const { id, quantity, description, total } = product

      await order.addProduct(id, {
        through: {
          quantity,
          description,
          total,
        },
      })
    })

    return res.json(order)
  }

  async delete(req, res) {
    const order = await Order.findByPk(req.params.id)

    try {
      await order.destroy()

      return res.json('Successfully deleted.')
    } catch (err) {
      return res.status(400).json({ error: 'Delete fails.' })
    }
  }
}

export default new OrderController()
