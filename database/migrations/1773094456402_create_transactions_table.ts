import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('client_id').unsigned().references('id').inTable('clients').onDelete('CASCADE')
      table
        .integer('gateway_id')
        .unsigned()
        .references('id')
        .inTable('gateways')
        .onDelete('SET NULL')

      table.string('external_id').nullable()
      table.enum('status', ['PENDING', 'PAID', 'FAILED', 'REFUNDED']).defaultTo('PENDING')
      table.integer('amount').notNullable()
      table.string('card_last_numbers', 4).notNullable()

      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
