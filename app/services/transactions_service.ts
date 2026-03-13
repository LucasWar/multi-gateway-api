import Transaction from '#models/transaction'
import TransactionProduct from '#models/transaction_product'
import { GatewayFactory } from './gateways/gateway_factory.ts'
import { type CheckoutPayload } from '../interfaces/checkout_payload.ts'
import { ProductService } from './products_service.ts'
import type { ProductInterface } from '../interfaces/products_interface.ts'
import { ClientService } from './client_service.ts'
import { GatewayService } from './gateway_service.ts'
import type Gateway from '#models/gateway'
import Database from '@adonisjs/lucid/services/db'
import type { ServiceResponse } from '../contracts/service_response.ts'
import { Exception } from '@adonisjs/core/exceptions'

export class TransactionService {
  private productService = new ProductService()
  private clientService = new ClientService()
  private gatewayService = new GatewayService()

  public async processCheckout(payload: CheckoutPayload): Promise<ServiceResponse<Transaction>> {
    const productIds = payload.products.map((p) => p.productId)

    const products = await this.productService.findProductsById(productIds)

    const totalAmount = this.calcTotalAmount(products, payload)

    const client = await this.clientService.firstOrCreateByEmail({
      email: payload.email,
      name: payload.name,
    })

    const gateways = await this.gatewayService.listAllActive()

    if (!gateways.length) {
      throw new Exception('Nenhum gateway disponivel', { status: 503 })
    }

    const { paymentSuccess, externalTransactionId, usedGatewayId } = await this.sendTransactionGateways(gateways, totalAmount, payload)

    const transaction = await Database.transaction(async (trx) => {
      const transactionCreate = await Transaction.create(
        {
          clientId: client.id,
          gatewayId: usedGatewayId,
          externalId: externalTransactionId,
          status: paymentSuccess ? 'PAID' : 'FAILED',
          amount: totalAmount,
          cardLastNumbers: payload.cardNumber.slice(-4),
        },
        { client: trx }
      )

      const transactionProductsData = payload.products.map((item) => ({
        transactionId: transactionCreate.id,
        productId: item.productId,
        quantity: item.quantity,
      }))

      await TransactionProduct.createMany(transactionProductsData, { client: trx })

      return transactionCreate
    })

    return {
      success: paymentSuccess,
      data: transaction,
    }
  }

  public async refund(id: number): Promise<ServiceResponse<Transaction>> {
    const transaction = await Transaction.find(id)

    if (!transaction) {
      throw new Exception('Trasação não encontrada', { status: 404 })
    }

    if (transaction.status === 'REFUNDED') {
      throw new Exception('Esta transação já foi reembolsada.', { status: 409 })
    }

    if (transaction.status !== 'PAID') {
      throw new Exception('Apenas transações pagas podem ser reembolsadas.', { status: 409 })
    }

    await transaction.load('gateway')

    const service = GatewayFactory.make(transaction.gateway.name)

    if (!service) {
      throw new Exception('Gateway desconhecido para reembolso.', { status: 404 })
    }

    const refundResponse = await service.refund(transaction.externalId!)

    if (!refundResponse.success) {
      throw new Exception(`Erro ao processar estorno no gateway: ${refundResponse.errorMessage}`, {
        status: 400,
      })
    }

    transaction.status = 'REFUNDED'
    await transaction.save()

    return {
      success: true,
      message: 'Reembolso realizado com sucesso!',
      data: transaction,
    }
  }

  async findUniqueById(id: number): Promise<ServiceResponse<Transaction>> {
    const transaction = await Transaction.find(id)
    if (!transaction) {
      throw new Exception('Compra não encontrado', { status: 404 })
    }

    await transaction.load('gateway')

    return {
      success: true,
      data: transaction,
    }
  }

  public async findMany(): Promise<ServiceResponse<Transaction[]>> {
    const transactions = await Transaction.query()
      .preload('client')
      .preload('gateway')
      .preload('items', (itemsQuery) => {
        itemsQuery.preload('product')
      })
      .orderBy('createdAt', 'desc')

    return { success: true, data: transactions }
  }

  private calcTotalAmount(products: ProductInterface[], payload: CheckoutPayload) {
    let totalAmount = 0

    const productsMap = new Map(products.map((p) => [p.id, p]))

    for (const item of payload.products) {
      const product = productsMap.get(item.productId)

      if (!product) throw new Error('Produto não encontrado')

      totalAmount += product.amount * item.quantity
    }

    return totalAmount
  }

  private async sendTransactionGateways(
    gateways: Gateway[],
    totalAmount: number,
    payload: CheckoutPayload
  ) {
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

    return { paymentSuccess, externalTransactionId, usedGatewayId }
  }
}
