import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { createProductDTO } from './dto/createProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  create(data: createProductDTO): Promise<any> {
    const product = new Product();
    product.productName = data.productName;
    product.productPrice = data.productPrice;
    product.productImage = data.productImage;
    return this.productRepository.save(product);
  }

  findById(id: number): Promise<Product> {
    return this.productRepository.findOneBy({
      id: id,
    });
  }

  async updateProduct(id: number, data: createProductDTO): Promise<any> {
    const currentProduct = await this.productRepository.findOneBy({
      id: id,
    });

    currentProduct.productName = data?.productName;
    currentProduct.productPrice = data?.productPrice;
    currentProduct.productImage = data?.productImage;
    return this.productRepository.save(currentProduct);
  }

  async remove(id: number): Promise<any> {
    const product = await this.productRepository.findOneBy({
      id: id,
    });
    return this.productRepository.remove(product);
  }
}
