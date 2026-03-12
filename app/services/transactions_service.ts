import Product from '#models/product'
import Gateway from '#models/gateway'
import Transaction from '#models/transaction'
import Client from '#models/client'
import TransactionProduct from '#models/transaction_product'
import { GatewayFactory } from './gateways/gateway_factory.ts'

export class TransactionService {
  public async processCheckout(payload: any) {
    const productIds = payload.products.map((p: any) => p.productId)

    const products = await Product.query().whereIn('id', productIds)

    let totalAmount = 0

    for (const item of payload.products) {
      const product = products.find((p) => p.id === item.productId)
      if (!product) throw new Error('Produto não encontrado')

      totalAmount += product.amount * item.quantity
    }

    const client = await Client.firstOrCreate(
      { email: payload.email },
      { name: payload.name, email: payload.email }
    )

    const gateways = await Gateway.query().where('isActive', true).orderBy('priority', 'asc')

    if (!gateways.length) {
      return {
        success: false,
        error: 'Nenhum gateway disponível',
      }
    }

    let paymentSuccess = false
    let externalTransactionId = null
    let usedGatewayId = null

    for (const gateway of gateways) {
      const service = GatewayFactory.make(gateway.name)

      if (!service) continue

      const response = await service.pay({
        amount: totalAmount,
        name: payload.name,
        email: payload.email,
        cardNumber: payload.cardNumber,
        cvv: payload.cvv,
      })

      if (response.success) {
        paymentSuccess = true
        externalTransactionId = response.externalId
        usedGatewayId = gateway.id

        break
      }
    }

    const transaction = await Transaction.create({
      clientId: client.id,
      gatewayId: usedGatewayId || gateways[0].id,
      externalId: externalTransactionId,
      status: paymentSuccess ? 'PAID' : 'FAILED',
      amount: totalAmount,
      cardLastNumbers: payload.cardNumber.slice(-4),
    })

    const transactionProductsData = payload.products.map((item: any) => ({
      transactionId: transaction.id,
      productId: item.productId,
      quantity: item.quantity,
    }))

    await TransactionProduct.createMany(transactionProductsData)

    return {
      success: paymentSuccess,
      transaction,
    }
  }

  public async listAll() {
    const transactions = await Transaction.query()
      .preload('client')
      .preload('gateway')
      .preload('items', (itemsQuery) => {
        itemsQuery.preload('product')
      })
      .orderBy('createdAt', 'desc')

    return transactions
  }
}
