import type { HttpContext } from '@adonisjs/core/http'
import { checkoutSchema } from '#validators/transactions'
import { TransactionService } from '#services/transactions_service'
import { ErrorCode } from '../enum/error_code_enum.ts'

export default class TransactionsController {
  private transactionService = new TransactionService()

  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(checkoutSchema)

    const transaction = await this.transactionService.processCheckout(payload)

    if (transaction.status === 'FAILED') {
      return response.created({
        success: false,
        message: 'Pagamento recusado em todos os gateways.',
        code: ErrorCode.PAYMENT_FAILED,
        data: transaction,
      })
    }

    return response.created({
      success: true,
      message: 'Trasação criada com sucesso',
      data: transaction,
    })
  }

  public async index({ response, request }: HttpContext) {
    const page = request.input('page', 1) ?? 1
    const limit = request.input('limit', 10) ?? 10

    const transactions = await this.transactionService.findMany(page, limit)

    return response.ok(transactions)
  }

  public async refund({ response, request }: HttpContext) {
    const transaction = await this.transactionService.refund(request.param('id'))

    return response.ok({
      success: true,
      message: 'Transação estornada com sucesso',
      data: transaction,
    })
  }

  async findUnique({ request, response }: HttpContext) {
    const transaction = await this.transactionService.findUniqueById(request.param('id'))

    return response.ok({
      success: true,
      data: transaction,
    })
  }
}
