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
import AppException from '#exceptions/app_exception'
import { ErrorCode } from '../enum/error_code_enum.ts'

export class TransactionService {
  private productService = new ProductService()
  private clientService = new ClientService()
  private gatewayService = new GatewayService()

  public async processCheckout(payload: CheckoutPayload) {
    const productIds = payload.products.map((p) => p.productId)

    const products = await this.productService.findProductsById(productIds)

    const totalAmount = this.calcTotalAmount(products, payload)

    const client = await this.clientService.firstOrCreateByEmail({
      email: payload.email,
      name: payload.name,
    })

    const gateways = await this.gatewayService.listAllActive()

    if (!gateways.length) {
      throw new AppException('Nenhum gateway disponivel.', 503, ErrorCode.NO_GATEWAY_AVAILABLE)
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

    return transaction
  }

  public async refund(id: number) {
    const transaction = await Transaction.find(id)

    if (!transaction) {
      throw new AppException('Transação não encontrada.', 404, ErrorCode.TRANSACTION_NOT_FOUND)
    }

    if (transaction.status === 'REFUNDED') {
      throw new AppException('Transação ja estornada.', 409, ErrorCode.TRANSACTION_ALREADY_REVERSED)
    }

    if (transaction.status !== 'PAID') {
      throw new AppException(
        'Apenas transações pagas podem ser reembolsadas.',
        409,
        ErrorCode.TRANSACTION_ALREADY_REVERSED
      )
    }

    await transaction.load('gateway')

    const service = GatewayFactory.make(transaction.gateway.name)

    if (!service) {
      throw new AppException(
        'Gateway desconhecido para reembolso.',
        404,
        ErrorCode.GATEWAY_NOT_FOUND
      )
    }

    const refundResponse = await service.refund(transaction.externalId!)

    if (!refundResponse.success) {
      throw new AppException(
        `Erro ao processar estorno no gateway: ${refundResponse.errorMessage}`,
        400,
        ErrorCode.GATEWAY_REFUND_FAILED
      )
    }

    transaction.status = 'REFUNDED'
    await transaction.save()

    return transaction
  }

  async findUniqueById(id: number): Promise<ServiceResponse<Transaction>> {
    const transaction = await Transaction.find(id)
    if (!transaction) {
      return {
        success: false,
        message: 'Compra não encontrado',
        statusCode: 404,
      }
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
