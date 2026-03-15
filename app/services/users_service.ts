import User from '#models/user'
import type { CreateUser, UpdateUser } from '../interfaces/users_interfaces.ts'
import hash from '@adonisjs/core/services/hash'
import AppException from '#exceptions/app_exception'
import { ErrorCode } from '../enum/error_code_enum.ts'

export class UserService {
  async findUserById(id: number) {
    const user = await User.find(id)

    if (!user) {
      throw new AppException('Usuário não encontrado', 404, ErrorCode.USER_NOT_FOUND)
    }

    return user
  }

  async create(payload: CreateUser) {
    await this.validateEmail(payload.email)

    payload.password = await hash.make(payload.password)

    const newUser = await User.create(payload)

    return newUser
  }

  async update(payload: UpdateUser, id: number) {
    const user = await this.findUserById(id)

    if (payload.password) {
      payload.password = await hash.make(payload.password)
    }

    if (payload.email && user.email !== payload.email) {
      await this.validateEmail(payload.email)
    }

    user.merge(payload)

    await user.save()

    return user
  }

  async delete(id: number) {
    const user = await this.findUserById(id)

    await user.delete()
  }

  private async validateEmail(email: string) {
    if (email) {
      const uniqueEmail = await User.findBy('email', email)

      if (uniqueEmail) {
        throw new AppException('Email duplicados', 409, ErrorCode.EMAIL_ALREADY_EXISTS)
      }
    }
  }
}
