import { ClientService } from '#services/client_service'
import { type HttpContext } from '@adonisjs/core/http'

export default class ClientsController {
  private clientsService = new ClientService()

  async index({ request }: HttpContext) {
    const page = request.input('page', 1) ?? 1
    const limit = request.input('limit', 10) ?? 10

    return this.clientsService.findMany(page, limit)
  }

  async findUnique({ request, response }: HttpContext) {
    const result = await this.clientsService.findUniqueById(request.param('id'))

    return response.ok(result)
  }
}
