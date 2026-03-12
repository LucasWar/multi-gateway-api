import type { HttpContext } from '@adonisjs/core/http'
import Gateway from '#models/gateway'
import { prioritySchema, statusSchema } from '#validators/gateways'
import { GatewayService } from '#services/gateway_service'

export default class GatewaysController {
  private gatewayService = new GatewayService()

  public async index({ response, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const gateways = await Gateway.query().orderBy('priority', 'asc').paginate(page, limit)
    return response.ok(gateways)
  }

  public async updateStatus({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(statusSchema)

    const result = await this.gatewayService.changeStatus(payload, params.id)

    return response.ok(result)
  }

  public async updatePriority({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(prioritySchema)

    const result = await this.gatewayService.changePriority(payload, params.id)

    return response.ok(result)
  }
}
