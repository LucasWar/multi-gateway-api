import Gateway from '#models/gateway'
import { Exception } from '@adonisjs/core/exceptions'
import type { GatewayPriority, GatewayStatus } from '../interfaces/gateways_interface.ts'
import type { ServiceResponse } from '../contracts/service_response.ts'

export class GatewayService {
  async changeStatus(payload: GatewayStatus, id: number): Promise<ServiceResponse<Gateway>> {
    const gateway = await Gateway.find(id)

    if (!gateway) {
      throw new Exception('Gateway não encontrado', { status: 404 })
    }

    gateway.isActive = payload.isActive

    await gateway.save()

    const status = gateway.isActive ? 'ativado' : 'desativado'

    return {
      success: true,
      message: `O gateway: '${gateway.name}' foi ${status}`,
      data: gateway,
    }
  }

  async changePriority(payload: GatewayPriority, id: number): Promise<ServiceResponse<Gateway>> {
    const gateway = await Gateway.find(id)

    if (!gateway) {
      throw new Exception('Gateway não encontrado', { status: 404 })
    }

    const oldPriority = gateway.priority
    const newPriority = payload.priority

    if (newPriority !== oldPriority) {
      if (newPriority < oldPriority) {
        await Gateway.query()
          .where('priority', '>=', newPriority)
          .where('priority', '<', oldPriority)
          .increment('priority', 1)
      }

      if (newPriority > oldPriority) {
        await Gateway.query()
          .where('priority', '<=', newPriority)
          .where('priority', '>', oldPriority)
          .decrement('priority', 1)
      }

      gateway.priority = newPriority
      await gateway.save()
    }

    return {
      success: true,
      message: `A prioridade do ${gateway.name} foi alterada para ${gateway.priority}.`,
      data: gateway,
    }
  }

  async listAllActive() {
    return await Gateway.query().where('isActive', true).orderBy('priority', 'asc')
  }
}
