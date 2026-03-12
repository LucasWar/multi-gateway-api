import axios from 'axios'
import {
  type GatewayContract,
  type TransactionPayload,
  type GatewayResponse,
} from '../../contracts/gateway_contract.ts'

export class Gateway2Service implements GatewayContract {
  private baseURL = 'http://localhost:3002'

  public async pay(payload: TransactionPayload): Promise<GatewayResponse> {
    try {
      const gateway2Payload = {
        valor: payload.amount,
        nome: payload.name,
        email: payload.email,
        numeroCartao: payload.cardNumber,
        cvv: payload.cvv,
      }

      const response = await axios.post(`${this.baseURL}/transacoes`, gateway2Payload, {
        headers: {
          'Gateway-Auth-Token': 'tk_f2198cc671b5289fa856',
          'Gateway-Auth-Secret': '3d15e8ed6131446ea7e3456728b1211f',
        },
      })

      if (response.data.erros || response.data.statusCode >= 400) {
        throw new Error('Pagamento recusado pelo Mock do Gateway 2')
      }

      return {
        success: true,
        externalId: response.data.id,
      }
    } catch (error) {
      return {
        success: false,
        errorMessage: 'Erro ao processar pagamento no Gateway 2',
      }
    }
  }

  public async refund(transactionId: string): Promise<GatewayResponse> {
    try {
      await axios.post(
        `${this.baseURL}/transacoes/reembolso`,
        { id: transactionId },
        {
          headers: {
            'Gateway-Auth-Token': 'tk_f2198cc671b5289fa856',
            'Gateway-Auth-Secret': '3d15e8ed6131446ea7e3456728b1211f',
          },
        }
      )
      return { success: true }
    } catch (error) {
      return { success: false, errorMessage: 'Erro no estorno do Gateway 2' }
    }
  }
}
