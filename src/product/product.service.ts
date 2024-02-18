import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { PaginationDTO } from 'src/common/pagination/dto/paginationQuery-dto';
import { Pagination } from 'src/common/pagination';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService
  ) { }

  async createProduct(body: CreateProductDto) {
    const product = new Product(body)
    const createRepository = await this.productRepository.save({
      ...product,
      isActive: true
    })

    const productRepository = await this.productRepository.findOne({
      where: { id: createRepository.id },
      relations: ["category"]
    })

    return {
      status: HttpStatus.OK,
      data: productRepository
    }
  }

  async updateProduct(productId: string, body: UpdateProductDto) {
    const findProduct = await this.productRepository.findOne({
      where: { id: +productId }
    })

    if (!findProduct) {
      throw new HttpException("Product not found", HttpStatus.BAD_REQUEST)
    }

    const updateProduct = await this.productRepository.createQueryBuilder("product")
      .update()
      .set({
        ...body,
      })
      .where("id = :id", { id: +productId })
      .execute()

    const product = await this.productRepository.findOne({
      where: { id: +productId },
      relations: ["category"]
    })

    return {
      status: HttpStatus.OK,
      data: product
    }
  }

  async deleteProduct(productId: string) {
    const findProduct = await this.productRepository.findOne({
      where: { id: +productId }
    })

    if (!findProduct) {
      throw new HttpException("Product not found", HttpStatus.BAD_REQUEST)
    }

    const deleteProduct = await this.productRepository.createQueryBuilder("product")
      .update()
      .set({
        isActive: false
      })
      .where("id = :id", { id: +productId })
      .execute()

    return {
      status: HttpStatus.OK,
      data: findProduct.id,
      message: "Delete product success"
    }
  }

  async getProduct(user: User, id: string) {
    const product = await this.productRepository.createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.discount", "discount")
      .leftJoinAndSelect("product.productInventory", "productInventory")
      .leftJoinAndSelect("category.shop", "shop")
      .leftJoinAndSelect("shop.user", "user")
      .where("product.id = :id", { id })
      .andWhere('product.isActive = :isActive', { isActive: true })
      .getOne()

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND)
    }

    if (product.category.shop.userId !== user.id) {
      return product;
    }

    return product
  }

  async getAllProductWithShop(user: User, query: PaginationDTO): Promise<Pagination<any>> {
    const DEFAULT_LIMIT = 10;
    const DEFAULT_PAGE = 1;
    console.log("user", user.id)
    const { limit = DEFAULT_LIMIT, page = DEFAULT_PAGE, search = '' } = query;

    const take = limit;
    const skip = (page - 1) * take;

    const queryBuilder = await this.productRepository.createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.discount", "discount")
      .leftJoinAndSelect("category.shop", "shop")
      .leftJoinAndSelect("shop.user", "user")
      .where("user.id = :id", { id: user.id })
      .andWhere("product.isActive = :isActive", { isActive: true })
      .andWhere("product.name LIKE :search", { search: `%${search}%` })
      .andWhere("product.isActive = :isActive", { isActive: true })
      .orderBy("product.createAt", 'DESC')
      .take(take)
      .skip(skip)

    const results = await queryBuilder.getMany()
    const total = await queryBuilder.getCount()
    return new Pagination<any>({
      results: results,
      total,
    });

  }

  async getAllProduct(query: PaginationDTO): Promise<Pagination<any>> {
    const DEFAULT_LIMIT = 10;
    const DEFAULT_PAGE = 1;

    const { limit = DEFAULT_LIMIT, page = DEFAULT_PAGE, search = '', category = '' } = query;

    const take = limit;
    const skip = (page - 1) * take;

    const products = await this.productRepository.createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.discount", "discount")
      .leftJoinAndSelect("product.productInventory", "productInventory")
      .leftJoinAndSelect("category.shop", "shop")
      .leftJoinAndSelect("shop.user", "user")
      .where("product.name LIKE :search", { search: `%${search}%` })
      .where("category.name LIKE :search", { search: `%${category}%` })
      .andWhere("product.isActive = :isActive", { isActive: true })
      .take(take)
      .skip(skip)

    const results = await products.getMany()
    const total = await products.getCount()

    return new Pagination<any>({
      results: results,
      total,
    });

  }

  async getProductWithShopId(shopId: string) {
    const products = await this.productRepository.createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.discount", "discount")
      .leftJoinAndSelect("product.productInventory", "productInventory")
      .leftJoinAndSelect("category.shop", "shop")
      .leftJoinAndSelect("shop.user", "user")
      .where("shop.id = :id", { id: shopId })
      .andWhere("product.isActive = :isActive", { isActive: true })
      .getMany()

    if (!products) {
      throw new HttpException('Shop not found', HttpStatus.NOT_FOUND)
    }

    return products
  }

  async newProductInAMonth() {
    const products = await this.productRepository.createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.discount", "discount")
      .leftJoinAndSelect("product.productInventory", "productInventory")
      .leftJoinAndSelect("category.shop", "shop")
      .leftJoinAndSelect("shop.user", "user")
      .where("product.createAt >= :date", { date: new Date(new Date().setDate(new Date().getDate() - 30)) })
      .andWhere("product.isActive = :isActive", { isActive: true })
      .andWhere("productInventory.image IS NOT NULL")
      .getMany()

    if (!products) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND)
    }

    return products
  }

  async findProductByCategory(query: { categoryName: string }) {
    if (!query.categoryName) {
      return null
    }
    const { categoryName } = query
    console.log({ categoryName })
    const product = await this.productRepository.createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.discount", "discount")
      .leftJoinAndSelect("product.productInventory", "productInventory")
      .leftJoinAndSelect("category.shop", "shop")
      .leftJoinAndSelect("shop.user", "user")
      .where("category.name ILIKE :name", { name: `%${categoryName.trim()}%` })
      .andWhere("category.isActive = :isActive", { isActive: true })
      .andWhere("product.isActive = :isActive", { isActive: true })
      .getMany()

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND)
    }

    return product
  }

  async getShopByProduct(productId: string) {
    const product = await this.productRepository.createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("category.shop", "shop")
      .leftJoinAndSelect("shop.user", "user")
      .select([
        'user.id as userId'
      ])
      .where("product.id = :id", { id: productId })
      .andWhere("product.isActive = :isActive", { isActive: true })
      .getRawOne()

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND)
    }

    return product
  }

  async shopIsOwnerOfProduct(user: User, productId: string) {
    const product = await this.productRepository.createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("category.shop", "shop")
      .leftJoinAndSelect("shop.user", "user")
      .select([
        'user.id as userId'
      ])
      .where("product.id = :id", { id: productId })
      .andWhere("product.isActive = :isActive", { isActive: true })
      .getRawOne()

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND)
    }
    if (+product.userid !== user.id) {
      return false
    }

    return true
  }
}
