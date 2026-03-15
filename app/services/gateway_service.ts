import Gateway from '#models/gateway'
import type { GatewayPriority, GatewayStatus } from '../interfaces/gateways_interface.ts'
import AppException from '#exceptions/app_exception'
import { ErrorCode } from '../enum/error_code_enum.ts'

export class GatewayService {
  async findUniqueById(id: number) {
    const gateway = await Gateway.find(id)

    if (!gateway) {
      throw new AppException('Gateway não encontrado', 404, ErrorCode.GATEWAY_NOT_FOUND)
    }

    return gateway
  }

  async changeStatus(payload: GatewayStatus, id: number) {
    const gateway = await this.findUniqueById(id)

    gateway.isActive = payload.isActive

    await gateway.save()

    const status = gateway.isActive ? 'ativado' : 'desativado'

    return {
      success: true,
      message: `O gateway: '${gateway.name}' foi ${status}`,
      data: gateway,
    }
  }

  async changePriority(payload: GatewayPriority, id: number) {
    const gateway = await this.findUniqueById(id)

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
