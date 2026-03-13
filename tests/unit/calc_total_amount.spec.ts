import { TransactionService } from '#services/transactions_service'
import { test } from '@japa/runner'

test.group('TransactionService calcTotalAmount', () => {
  test('deve calcular corretamente o valor total da compra', ({ assert }) => {
    const service = new TransactionService()

    const products = [{ id: 1, amount: 100 } as any, { id: 2, amount: 200 } as any]

    const payload = {
      products: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 },
      ],
    } as any

    const total = service['calcTotalAmount'](products, payload)

    assert.equal(total, 400)
  })
})
