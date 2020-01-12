import Sequelize from 'sequelize'

import File from '../app/models/File'
import User from '../app/models/User'
import Order from '../app/models/Order'
import Client from '../app/models/Client'
import Product from '../app/models/Product'
import ProductOrder from '../app/models/ProductOrder'

import databaseConfig from '../config/database'

const models = [File, User, Order, Client, Product, ProductOrder]

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
