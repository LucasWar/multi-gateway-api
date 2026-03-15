import Client from '#models/client'
import type { ClientPayload } from '../interfaces/clients_interface.ts'
import AppException from '#exceptions/app_exception'
import { ErrorCode } from '../enum/error_code_enum.ts'

export class ClientService {
  async findMany(page: number, limit: number) {
    return await Client.query().preload('transactions').paginate(page, limit)
  }

  async findUniqueById(id: number) {
    const client = await Client.find(id)
    if (!client) {
      throw new AppException('Cliente não encontrado', 404, ErrorCode.CLIENT_NOT_FOUND)
    }

    await client.load('transactions')

    return {
      success: true,
      data: client,
    }
  }

  async firstOrCreateByEmail(payload: ClientPayload) {
    return await Client.firstOrCreate(
      { email: payload.email },
      { name: payload.name, email: payload.email }
    )
  }
}
