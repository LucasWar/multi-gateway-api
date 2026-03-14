import Product from '#models/product'
import { type ServiceResponse } from '../contracts/service_response.ts'
import type { ProductUpdatePayload, ProductPayload } from '../interfaces/products_interface.ts'

export class ProductService {
  async findProductsById(ids: number[]) {
    return await Product.query().whereIn('id', ids)
  }

  async findProductById(id: number): Promise<ServiceResponse<Product>> {
    const product = await Product.find(id)

    if (!product) {
      return {
        success: false,
        message: 'Produto não encontrado',
        statusCode: 404,
      }
    }

    return {
      success: true,
      message: 'Produto encontrado',
      statusCode: 200,
      data: product,
    }
  }

  async create(payload: ProductPayload): Promise<ServiceResponse<Product>> {
    const product = await Product.create(payload)

    return {
      success: true,
      message: 'Produto criado com sucesso',
      statusCode: 201,
      data: product,
    }
  }

  async update(payload: ProductUpdatePayload, id: number): Promise<ServiceResponse<Product>> {
    const product = await Product.find(id)

    if (!product) {
      return {
        success: false,
        message: 'Produto não encontrado',
        statusCode: 404,
      }
    }

    product.merge(payload)

    await product.save()

    return {
      success: true,
      message: 'Produto atualizado com sucesso',
      statusCode: 200,
      data: product,
    }
  }

  async delete(id: number): Promise<ServiceResponse<Product>> {
    const product = await Product.find(id)

    if (!product) {
      return {
        success: false,
        message: 'Produto não encontrado',
        statusCode: 404,
      }
    }

    await product.delete()

    return {
      success: true,
      message: 'Produto deletado com sucesso',
      statusCode: 200,
    }
  }
}
