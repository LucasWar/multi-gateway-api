export interface ProductInterface {
  id: number
  amount: number
  name: string
}

export interface ProductPayload {
  amount: number
  name: string
}

export interface ProductUpdatePayload {
  amount?: number
  name?: string
}
