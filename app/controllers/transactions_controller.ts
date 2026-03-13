import type { HttpContext } from '@adonisjs/core/http'
import { checkoutSchema } from '#validators/transactions'
import { TransactionService } from '#services/transactions_service'

export default class TransactionsController {
  private transactionService = new TransactionService()

  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(checkoutSchema)

    const result = await this.transactionService.processCheckout(payload)

    return response.created(result)
  }

  public async index({ response }: HttpContext) {
    const transactions = await this.transactionService.findMany()
    return response.ok(transactions)
  }

  public async refund({ response, request }: HttpContext) {
    const result = await this.transactionService.refund(request.param('id'))

    return response.ok(result)
  }

  async findUnique({ request, response }: HttpContext) {
    const result = await this.transactionService.findUniqueById(request.param('id'))

    return response.ok(result)
  }
}
