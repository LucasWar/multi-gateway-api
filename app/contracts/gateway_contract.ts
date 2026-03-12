export interface TransactionPayload {
  amount: number
  name: string
  email: string
  cardNumber: string
  cvv: string
}

export interface GatewayResponse {
  success: boolean
  externalId?: string
  errorMessage?: string
}

export interface GatewayContract {
  pay(payload: TransactionPayload): Promise<GatewayResponse>
  refund(transactionId: string): Promise<GatewayResponse>
}
