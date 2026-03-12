import { TransactionSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Client from '#models/client'
import Gateway from '#models/gateway'
import TransactionProduct from '#models/transaction_product'

export default class Transaction extends TransactionSchema {
  // Uma transação PERTENCE a um Cliente
  @belongsTo(() => Client)
  declare client: BelongsTo<typeof Client>

  // Uma transação PERTENCE a um Gateway
  @belongsTo(() => Gateway)
  declare gateway: BelongsTo<typeof Gateway>

  // Uma transação TEM MUITOS Itens (TransactionProduct)
  @hasMany(() => TransactionProduct)
  declare items: HasMany<typeof TransactionProduct>
}
