import AppException from '#exceptions/app_exception'
import Product from '#models/product'
import { ErrorCode } from '../enum/error_code_enum.ts'
import type { ProductUpdatePayload, ProductPayload } from '../interfaces/products_interface.ts'

export class ProductService {
  async findProductsById(ids: number[]) {
    return await Product.query().whereIn('id', ids)
  }

  async findProductById(id: number) {
    const product = await Product.find(id)

    if (!product) {
      throw new AppException('Produto não encontrado', 404, ErrorCode.PRODUCT_NOT_FOUND)
    }

    return product
  }

  async create(payload: ProductPayload) {
    const product = await Product.create(payload)
    return product
  }

  async update(payload: ProductUpdatePayload, id: number) {
    const product = await this.findProductById(id)

    product.merge(payload)

    await product.save()

    return product
  }

  async delete(id: number) {
    const product = await this.findProductById(id)

    await product.delete()
  }
}
