import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import { productSchema } from '#validators/products'

export default class ProductsController {
  public async index({ response }: HttpContext) {
    const products = await Product.all()
    return response.ok(products)
  }

  public async show({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    return response.ok(product)
  }

  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(productSchema)
    const product = await Product.create(payload)
    return response.created({ message: 'Produto criado com sucesso!', product })
  }

  public async update({ params, request, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const payload = await request.validateUsing(productSchema)

    product.merge(payload)
    await product.save()

    return response.ok({ message: 'Produto atualizado com sucesso!', product })
  }

  public async destroy({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()
    return response.ok({ message: 'Produto excluído com sucesso!' })
  }
}
