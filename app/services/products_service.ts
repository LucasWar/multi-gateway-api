import Product from '#models/product'

export class ProductService {
  async findProductsById(ids: number[]) {
    return await Product.query().whereIn('id', ids)
  }
}
