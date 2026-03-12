import { type GatewayContract } from '../../contracts/gateway_contract.ts'
import { Gateway1Service } from './gateway1_service.ts'
import { Gateway2Service } from './gateway2_service.ts'

export class GatewayFactory {
  public static make(name: string): GatewayContract | null {
    const gateways: Record<string, GatewayContract> = {
      'Gateway 1': new Gateway1Service(),
      'Gateway 2': new Gateway2Service(),
    }

    return gateways[name] || null
  }
}
