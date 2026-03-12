import vine from '@vinejs/vine'

export const statusSchema = vine.create(
  vine.object({
    isActive: vine.boolean(),
  })
)

export const prioritySchema = vine.create(
  vine.object({
    priority: vine.number().min(1),
  })
)
