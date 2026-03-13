import Client from '#models/client'
import { Exception } from '@adonisjs/core/exceptions'
import type { ClientPayload } from '../interfaces/clients_interface.ts'
import { type ServiceResponse } from '../contracts/service_response.ts'

export class ClientService {
  async findMany() {
    return await Client.query().preload('transactions')
  }

  async findUniqueById(id: number): Promise<ServiceResponse<Client>> {
    const client = await Client.find(id)
    if (!client) {
      throw new Exception('Cliente não encontrado', { status: 404 })
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
