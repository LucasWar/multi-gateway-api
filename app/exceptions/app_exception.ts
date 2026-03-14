import { Exception } from '@adonisjs/core/exceptions'
import { type HttpContext } from '@adonisjs/core/http'

export default class AppException extends Exception {
  constructor(
    message: string,
    public status: number = 400,
    public code: string = 'E_APP_EXCEPTION'
  ) {
    super(message, { status, code })
  }

  async handle(error: this, { response }: HttpContext) {
    response.status(error.status).send({
      success: false,
      message: error.message,
      code: error.code,
    })
  }
}
