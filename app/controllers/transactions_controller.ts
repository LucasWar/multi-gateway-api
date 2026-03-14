import type { HttpContext } from '@adonisjs/core/http'
import { checkoutSchema } from '#validators/transactions'
import { TransactionService } from '#services/transactions_service'

export default class TransactionsController {
  private transactionService = new TransactionService()

  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(checkoutSchema)

    const transaction = await this.transactionService.processCheckout(payload)

    return response.created({
      success: true,
      message: 'Trasação criada com sucesso',
      data: transaction,
    })
  }

  public async index({ response }: HttpContext) {
    const result = await this.transactionService.findMany()

    if (result.success === false) {
      const { statusCode, ...content } = result
      return response.status(statusCode ?? 400).json({
        ...content,
      })
    }

    return response.ok(result)
  }

  public async refund({ response, request }: HttpContext) {
    const transaction = await this.transactionService.refund(request.param('id'))

    return response.ok({
      success: true,
      message: 'Transação criada com sucesso',
      data: transaction,
    })
  }

  async findUnique({ request, response }: HttpContext) {
    const result = await this.transactionService.findUniqueById(request.param('id'))

    if (result.success === false) {
      const { statusCode, ...content } = result
      return response.status(statusCode ?? 400).json({
        ...content,
      })
    }

    return response.ok(result)
  }
}
