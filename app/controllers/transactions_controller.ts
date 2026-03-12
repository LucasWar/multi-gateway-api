import type { HttpContext } from '@adonisjs/core/http'
import { checkoutSchema } from '#validators/transactions'
import { TransactionService } from '#services/transactions_service'

export default class TransactionsController {
  private transactionService = new TransactionService()

  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(checkoutSchema)

    const result = await this.transactionService.processCheckout(payload)

    if (result.error) {
      return response.status(500).send({ error: result.error })
    }

    if (!result.success) {
      return response.status(400).send({
        error: 'Pagamento recusado em todos os gateways.',
        transactionId: result.transaction?.id,
      })
    }

    return response.status(201).send({
      message: 'Compra realizada com sucesso!',
      transactionId: result.transaction?.id,
      status: result.transaction?.status,
    })
  }

  public async index({ response }: HttpContext) {
    const transactions = await this.transactionService.listAll()
    return response.ok(transactions)
  }
}
