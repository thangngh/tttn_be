import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductInventoryDto } from './dto/create-product_inventory.dto';
import { UpdateProductInventoryDto } from './dto/update-product_inventory.dto';
import { ProductInventory } from './entities/product_inventory.entity';
import { IKey } from 'src/auth/interface/auth.interface';
import * as fs from 'fs';
@Injectable()
export class ProductInventoryService {
  constructor(
    @InjectRepository(ProductInventory)
    private readonly productInventoryRepository: Repository<ProductInventory>,
  ) { }

  async createProductInventory(body: CreateProductInventoryDto, file: Array<Express.Multer.File>) {
    const { productId, quantity, price } = body
    const avatarPath = file.join("");
    const productInventory = new ProductInventory({
      productId: +productId,
      quantity: quantity,
      image: avatarPath,
      price: price,
      createAt: new Date()
    })
    const createRepository = await this.productInventoryRepository.save({
      ...productInventory,
      isActive: true
    })
    return {
      status: HttpStatus.OK,
      data: createRepository
    }
  }

  async updateProductInventory(body: UpdateProductInventoryDto, id: string) {
    const { productId, quantity, price } = body
    // fs.unlink(`${__dirname}/uploads/${image}`, (err) => {
    //   console.error(err)
    // })
    const productInventory = await this.productInventoryRepository.findOne({
      where: { id: +id }
    })
    if (productInventory) {
      productInventory.quantity = quantity
      // productInventory.image = image
      productInventory.price = price
      const updateRepository = await this.productInventoryRepository.save(productInventory)
      return {
        status: HttpStatus.OK,
        data: updateRepository
      }
    }
  }

  async updateProductInventoryQuantityDec(body: IKey) {
    const { productId, quantityChange, productInventoryId } = body
    const productInventory = await this.productInventoryRepository.createQueryBuilder("product_inventory")
      .leftJoinAndSelect("product_inventory.product", "product")
      .leftJoinAndSelect("product.category", "category")
      .andWhere("product_inventory.id = :id", { id: productInventoryId })
      .andWhere("product.id = :productId", { productId: productId })
      .getOne()
    if (productInventory) {
      productInventory.quantity -= +quantityChange
      await this.productInventoryRepository.save(productInventory)
      return {
        status: HttpStatus.OK,
        message: 'Product inventory quantity updated successfully'
      }
    } else {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Product inventory not found'
      }
    }
  }

  async updateProductInventoryQuantityInc(body: IKey) {
    const { productId, quantityChange, productInventoryId } = body
    const productInventory = await this.productInventoryRepository.createQueryBuilder("product_inventory")
      .leftJoinAndSelect("product_inventory.product", "product")
      .leftJoinAndSelect("product.category", "category")
      .andWhere("product_inventory.id = :id", { id: productInventoryId })
      .andWhere("product.id = :productId", { productId: productId })
      .getOne()

    if (productInventory) {
      productInventory.quantity += +quantityChange
      await this.productInventoryRepository.save(productInventory)
      return {
        status: HttpStatus.OK,
        message: 'Product inventory quantity updated successfully'
      }
    } else {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Product inventory not found'
      }
    }
  }

  async findProductAndProductInventory(productInventoryId: string) {
    const product = await this.productInventoryRepository.createQueryBuilder("productInventory")
      .leftJoinAndSelect("productInventory.product", "product")
      .leftJoinAndSelect("product.category", "category")
      .andWhere("productInventory.id = :id", { id: productInventoryId })
      .andWhere("productInventory.isActive = :isActive", { isActive: true })
      .getOne()

    if (!product) {
      throw new HttpException("Product not found", HttpStatus.NOT_FOUND)
    }

    return product
  }

}
