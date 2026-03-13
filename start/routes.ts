import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const TransactionsController = () => import('#controllers/transactions_controller')
const AuthController = () => import('#controllers/auth_controller')
const ProductsController = () => import('#controllers/products_controller')
const UsersController = () => import('#controllers/users_controller')
const GatewaysController = () => import('#controllers/gateways_controller')
const ClientsController = () => import('#controllers/clients_controller')

router.post('/checkout', [TransactionsController, 'store'])
router.post('/login', [AuthController, 'login'])

// router.get('/users', [UsersController, 'index'])
// router.post('/users', [UsersController, 'store'])

router
  .group(() => {
    router.get('/transactions', [TransactionsController, 'index']).use(middleware.role(['MANAGER']))
    router.get('/transactions/:id', [TransactionsController, 'findUnique'])
    router
      .post('/transactions/:id/refund', [TransactionsController, 'refund'])
      .use(middleware.role(['FINANCE']))

    router
      .resource('products', ProductsController)
      .apiOnly()
      .use(['store', 'update', 'destroy'], middleware.role(['MANAGER', 'FINANCE']))

    router
      .resource('users', ProductsController)
      .apiOnly()
      .use(['store', 'update', 'destroy'], middleware.role(['MANAGER']))

    router
      .group(() => {
        router.get('/gateways', [GatewaysController, 'index'])
        router.post('/gateways/:id/status', [GatewaysController, 'updateStatus'])
        router.post('/gateways/:id/priority', [GatewaysController, 'updatePriority'])
      })
      .use(middleware.role(['ADMIN']))

    router.group(() => {
      router.get('/clients', [ClientsController, 'index'])
      router.get('/clients/:id', [ClientsController, 'findUnique'])
    })
  })
  .use(middleware.auth())
