import vine from '@vinejs/vine'

export const checkoutSchema = vine.create(
  vine.object({
    name: vine.string(),
    email: vine.string().email(),
    cardNumber: vine.string().minLength(16).maxLength(16),
    cvv: vine.string().minLength(3).maxLength(4),
    products: vine
      .array(
        vine.object({
          productId: vine.number(),
          quantity: vine.number().min(1),
        })
      )
      .minLength(1),
  })
)
