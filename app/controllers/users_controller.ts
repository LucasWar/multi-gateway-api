import User from '#models/user'
import { UserService } from '#services/users_service'
import { userSchema } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  private userService = new UserService()

  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    return await User.query().paginate(page, limit)
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(userSchema)

    const result = await this.userService.create(payload)

    return response.created(result)
  }

  public async destroy({ response, params }: HttpContext) {
    const result = await this.userService.delete(params.id)

    return response.ok(result)
  }

  public async update({ response, params, request }: HttpContext) {
    const user = await request.validateUsing(userSchema)

    const result = await this.userService.update(user, params.id)

    return response.ok(result)
  }
}
