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
    const product = await this.ptodutoService.findProductById(params.id)

    return response.ok({
      success: true,
      message: 'Produto encontrado',
      data: product,
    })
  }

  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(productSchema)

    const product = await this.ptodutoService.create(payload)

    return response.created({
      success: true,
      message: 'Produto criado com sucesso',
      data: product,
    })
  }

  public async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(productUpdateSchema)

    const product = await this.ptodutoService.update(payload, params.id)

    return response.ok({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: product,
    })
  }

  public async destroy({ params, response }: HttpContext) {
    await this.ptodutoService.delete(params.id)

    return response.ok({
      success: true,
      message: 'Produto deletado com sucesso',
    })
  }
}
