import { ClientService } from '#services/client_service'
import { type HttpContext } from '@adonisjs/core/http'

export default class ClientsController {
  private clientsService = new ClientService()

  async index() {
    return this.clientsService.findMany()
  }

  async findUnique({ request, response }: HttpContext) {
    const result = await this.clientsService.findUniqueById(request.param('id'))

    return response.ok(result)
  }
}
