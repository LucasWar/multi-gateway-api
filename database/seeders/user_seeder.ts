import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        email: 'admin@test.com',
        password: '123456',
        role: 'ADMIN',
      },
      {
        email: 'finance@test.com',
        password: '123456',
        role: 'FINANCE',
      },
      {
        email: 'manager@test.com',
        password: '123456',
        role: 'MANAGER',
      },
      {
        email: 'manager@test.com',
        password: '123456',
        role: 'USER',
      },
    ])
  }
}
