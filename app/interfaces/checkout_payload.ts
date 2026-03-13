export interface CheckoutPayload {
  name: string
  email: string
  cardNumber: string
  cvv: string
  products: {
    productId: number
    quantity: number
  }[]
}
