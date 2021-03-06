import { Op } from 'sequelize'
import * as Yup from 'yup'

import Product from '../models/Product'

class ProductController {
  async index(req, res) {
    const { page = 1, name = '' } = req.query

    const products = await Product.findAll({
      order: ['name'],
      limit: 10,
      offset: (page - 1) * 10,
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    })

    const count = await Product.count({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    })

    return res.json({
      products,
      count,
    })
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      quantity: Yup.number(),
      description: Yup.string(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' })
    }

    const { name, price, quantity, description } = req.body

    const productExists = await Product.findOne({ where: { name } })

    if (productExists) {
      return res.status(401).json({ error: 'Product already exists.' })
    }

    const product = await Product.create({
      name,
      price,
      quantity,
      description,
    })

    return res.json(product)
  }

  async delete(req, res) {
    const product = await Product.findByPk(req.params.id)

    try {
      await product.destroy()

      return res.json('Successfully deleted.')
    } catch (err) {
      return res.status(400).json({ error: 'Delete fails.' })
    }
  }
}

export default new ProductController()
