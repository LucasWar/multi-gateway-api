import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn, allowedRoles: string[]) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ error: 'Usuário não autenticado.' })
    }

    if (user.role === 'ADMIN') {
      return next()
    }

    if (user.role === null || !allowedRoles.includes(user.role)) {
      return response.forbidden({
        error: 'Acesso negado. O seu cargo não tem permissão para realizar esta ação.',
      })
    }

    return next()
  }
}
