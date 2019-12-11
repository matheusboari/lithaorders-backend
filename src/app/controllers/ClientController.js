import * as Yup from 'yup'

import Client from '../models/Client'

class ClientController {
  async index(req, res) {
    const { page = 1 } = req.query

    const clients = await Client.findAll({
      order: ['name'],
      limit: 20,
      offset: (page - 1) * 20,
    })

    return res.json(clients)
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      phone: Yup.string().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' })
    }

    const { name, email, phone } = req.body

    /**
     * Check if email already exists
     */
    const clientExists = await Client.findOne({ where: { email } })

    if (clientExists) {
      return res.status(401).json({ error: 'Client already exists' })
    }

    const client = await Client.create({
      name,
      email,
      phone,
    })

    return res.json(client)
  }

  async delete(req, res) {
    const client = await Client.findByPk(req.params.id)

    try {
      await client.destroy()

      return res.json('Successfully deleted.')
    } catch (err) {
      return res.status(400).json({ error: 'Delete fails.' })
    }
  }
}

export default new ClientController()
