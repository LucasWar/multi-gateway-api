import User from '#models/user'
import { UserService } from '#services/users_service'
import { userSchema, userUpdateSchema } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  private userService = new UserService()

  public async show({ params, response }: HttpContext) {
    const user = await this.userService.findUserById(params.id)

    return response.ok({
      success: true,
      message: 'Usuario encontrado',
      data: user,
    })
  }

  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    return await User.query().paginate(page, limit)
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(userSchema)

    const user = await this.userService.create(payload)

    return response.created({
      success: true,
      message: 'Usuário criado com sucesso !',
      data: user,
    })
  }

  public async destroy({ response, params }: HttpContext) {
    const result = await this.userService.delete(params.id)

    return response.ok({
      message: 'Usuário deletedo com sucesso !',
      success: true,
    })
  }

  public async update({ response, params, request }: HttpContext) {
    const payload = await request.validateUsing(userUpdateSchema)

    const user = await this.userService.update(payload, params.id)

    return response.ok({
      message: 'Usuário atualizado com sucesso ',
      success: true,
      data: user,
    })
  }
}
