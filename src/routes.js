import { Router } from 'express'

import authMiddleware from './app/middlewares/auth'

import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import ClientController from './app/controllers/ClientController'
import ProductController from './app/controllers/ProductController'
import OrderController from './app/controllers/OrderController'

const routes = new Router()

routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

routes.use(authMiddleware)

// Client routes

routes.get('/clients', ClientController.index)
routes.post('/clients', ClientController.store)
// routes.put('/clients', ClientController.update)
routes.delete('/clients/:id', ClientController.delete)

// Product routes

routes.get('/products', ProductController.index)
routes.post('/products', ProductController.store)
// routes.put('/products', ProductController.update)
routes.delete('/products/:id', ProductController.delete)

// Order routes

routes.get('/orders', OrderController.index)
routes.post('/orders', OrderController.store)
// routes.put('/orders', OrderController.update)
routes.delete('/orders/:id', OrderController.delete)

export default routes
