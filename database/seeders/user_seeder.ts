import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        email: 'admin@betalent.com',
        password: 'password123',
        role: 'ADMIN',
      },
      {
        email: 'finance@betalent.com',
        password: 'password123',
        role: 'FINANCE',
      },
      {
        email: 'manager@betalent.com',
        password: 'password123',
        role: 'MANAGER',
      },
      {
        email: 'manager@betalent.com',
        password: 'password123',
        role: 'USER',
      },
    ])
  }
}
