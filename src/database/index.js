import Sequelize from 'sequelize'

import User from '../app/models/User'
import Order from '../app/models/Order'
import Client from '../app/models/Client'
import Product from '../app/models/Product'

import databaseConfig from '../config/database'

const models = [User, Order, Client, Product]

class Database {
  constructor() {
    this.init()
  }

  init() {
    this.connection = new Sequelize(databaseConfig)

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models))
  }
}

export default new Database()
