import vine from '@vinejs/vine'

export const productSchema = vine.create(
  vine.object({
    name: vine.string().trim().minLength(2),
    amount: vine.number().min(1),
  })
)
