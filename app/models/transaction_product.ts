// app/models/transaction_product.ts
import { TransactionProductSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from '#models/product'

export default class TransactionProduct extends TransactionProductSchema {
  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>
}
