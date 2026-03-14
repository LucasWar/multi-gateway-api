import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import { productSchema, productUpdateSchema } from '#validators/products'
import { ProductService } from '#services/products_service'

export default class ProductsController {
  private ptodutoService = new ProductService()

  public async index({ response }: HttpContext) {
    const products = await Product.all()
    return response.ok(products)
  }

  public async show({ params, response }: HttpContext) {
    const result = await this.ptodutoService.findProductById(params.id)

    const { statusCode, ...content } = result

    return response.status(statusCode ?? 400).json({
      ...content,
    })
  }

  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(productSchema)

    const result = await this.ptodutoService.create(payload)

    const { statusCode, ...content } = result

    return response.status(statusCode ?? 400).json({
      ...content,
    })
  }

  public async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(productUpdateSchema)

    const result = await this.ptodutoService.update(payload, params.id)

    const { statusCode, ...content } = result

    return response.status(statusCode ?? 400).json({
      ...content,
    })
  }

  public async destroy({ params, response }: HttpContext) {
    const result = await this.ptodutoService.delete(params.id)

    const { statusCode, ...content } = result

    return response.status(statusCode ?? 400).json({
      ...content,
    })
  }
}
