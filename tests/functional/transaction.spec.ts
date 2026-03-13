import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Transaction from '#models/transaction'

test.group('Transactions', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('deve criar uma compra', async ({ client }) => {
    const response = await client.post('/checkout').json({
      name: 'João the test 2',
      email: 'joaothetest@email.com',
      cardNumber: '5569000000006063',
      cvv: '123',
      products: [
        {
          productId: 1,
          quantity: 1,
        },
      ],
    })
    response.assertStatus(201)
  })

  test('deve realizar refund de transação paga', async ({ client }) => {
    const user = await User.create({
      email: 'adminTest@email.com',
      password: '123456',
      role: 'ADMIN',
    })

    const transaction = await Transaction.create({
      clientId: 1,
      gatewayId: 1,
      externalId: 'abc123',
      status: 'PAID',
      amount: 1000,
      cardLastNumbers: '6063',
    })

    const response = await client.post(`/transactions/${transaction.id}/refund`).loginAs(user)

    response.assertStatus(200)
  })

  test('usuário comum (USER) não deve ter permissão para fazer reembolso', async ({ client }) => {
    const user = await User.create({
      email: 'comum@teste.com',
      password: 'password123',
      role: 'USER',
    })

    const response = await client.post('/transactions/1/refund').loginAs(user) // O Japa gera e injeta o Token Bearer automaticamente aqui!

    response.assertStatus(403)
    response.assertBodyContains({
      error: 'Acesso negado. O seu cargo não tem permissão para realizar esta ação.',
    })
  })

  test('não deve permitir refund de transação FAILED', async ({ client }) => {
    const user = await User.create({
      email: 'adminfail@test.com',
      password: '123456',
      role: 'ADMIN',
    })

    const transaction = await Transaction.create({
      clientId: 1,
      gatewayId: 1,
      externalId: 'abc123',
      status: 'FAILED',
      amount: 1000,
      cardLastNumbers: '6063',
    })

    const response = await client.post(`/transactions/${transaction.id}/refund`).loginAs(user)

    response.assertStatus(409)
  })
})
