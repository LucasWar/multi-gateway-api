import axios from 'axios'
import {
  type GatewayContract,
  type TransactionPayload,
  type GatewayResponse,
} from '../../contracts/gateway_contract.ts'

export class Gateway1Service implements GatewayContract {
  private baseURL = 'http://localhost:3001'

  private async getToken(): Promise<string> {
    const response = await axios.post(`${this.baseURL}/login`, {
      email: 'dev@betalent.tech',
      token: 'FEC9BB078BF338F464F96B48089EB498',
    })
    return response.data.token
  }

  public async pay(payload: TransactionPayload): Promise<GatewayResponse> {
    try {
      const token = await this.getToken()

      const response = await axios.post(`${this.baseURL}/transactions`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      return {
        success: true,
        externalId: response.data.id,
      }
    } catch (error) {
      return {
        success: false,
        errorMessage: 'Erro ao processar pagamento no Gateway 1',
      }
    }
  }

  public async refund(transactionId: string): Promise<GatewayResponse> {
    try {
      const token = await this.getToken()
      await axios.post(
        `${this.baseURL}/transactions/${transactionId}/charge_back`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      return { success: true }
    } catch (error) {
      return { success: false, errorMessage: 'Erro no estorno do Gateway 1' }
    }
  }
}
