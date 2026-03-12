// database/seeders/initial_data_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Gateway from '#models/gateway'
import Product from '#models/product'

export default class extends BaseSeeder {
  async run() {
    await Gateway.createMany([
      {
        name: 'Gateway 1',
        isActive: true,
        priority: 1,
      },
      {
        name: 'Gateway 2',
        isActive: true,
        priority: 2,
      },
    ])

    await Product.create({
      name: 'Notebook Pro',
      amount: 350000,
    })
  }
}
