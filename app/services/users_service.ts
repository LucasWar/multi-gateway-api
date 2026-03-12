import User from '#models/user'
import { Exception } from '@adonisjs/core/exceptions'
import type { CreateUser, UpdateUser } from '../interfaces/users_interfaces.ts'
import hash from '@adonisjs/core/services/hash'
import { type ServiceResponse } from '../contracts/service_response.ts'

export class UserService {
  async create(payload: CreateUser): Promise<ServiceResponse<User>> {
    await this.validateUserData({ email: payload.email })

    payload.password = await hash.make(payload.password)

    const newUser = await User.create(payload)

    return {
      success: true,
      message: 'Usuário criado com sucesso !',
      data: newUser,
    }
  }

  async update(payload: UpdateUser, id: number): Promise<ServiceResponse<User>> {
    const user = await User.find(id)

    if (!user) {
      throw new Exception('Usuário não encontrado !', { status: 404 })
    }

    if (payload.password) {
      payload.password = await hash.make(payload.password)
    }

    user.merge(payload)
    await user.save()

    return {
      message: 'Usuário atualizado com sucesso ',
      success: true,
      data: user,
    }
  }

  async delete(id: number): Promise<ServiceResponse<User>> {
    const user = await User.find(id)

    if (!user) {
      throw new Exception('Usuário não encontrado !', { status: 404 })
    }

    await user.delete()

    return {
      message: 'Usuário deletedo com sucesso !',
      success: true,
    }
  }

  private async validateUserData({ id, email }: { id?: number; email?: string }) {
    if (id) {
      const validUserId = await User.find(id)

      if (!validUserId) {
        throw new Exception('Usuário não encontrado !', { status: 404 })
      }
    }

    if (email) {
      const uniqueEmail = await User.findBy('email', email)

      if (uniqueEmail) {
        throw new Exception('Email ja cadastrado !', { status: 409 })
      }
    }
  }
}
