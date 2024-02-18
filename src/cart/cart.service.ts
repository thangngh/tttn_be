import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { User } from 'src/user/entities/user.entity';
import { IKey } from 'src/auth/interface/auth.interface';
import { ProductInventoryService } from 'src/product_inventory/product_inventory.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly productInventoryService: ProductInventoryService
  ) { }

  async addProductToCart(body: CreateCartDto) {
    const { productId, productInventoryId, userId, total, price } = body;

    const cart = await this.cartRepository.findOne({
      where: {
        productId: +productId,
        userId: +userId,
        productInventoryId: +productInventoryId,
        isActive: true
      }
    });

    if (cart) {
      throw new HttpException("Product already exists in cart", HttpStatus.BAD_REQUEST)
    }

    await this.productInventoryService.updateProductInventoryQuantityDec({
      productId,
      quantityChange: total.toString(),
      productInventoryId
    })

    const newCart = new Cart({
      productId: +productId,
      userId: +userId,
      total: +total,
      price: +price,
      productInventoryId: +productInventoryId
    })
    console.log("newCart", newCart)
    const addCart = await this.cartRepository.save(newCart);

    if (!addCart) {
      throw new HttpException("Add product to cart failed", HttpStatus.BAD_REQUEST)
    }

    return {
      data: addCart,
      message: "Add product to cart successfully",
      status: HttpStatus.OK
    };
  }

  async findAllProductCartUser(user: User) {
    const cart = await this.cartRepository.createQueryBuilder("cart")
      .leftJoinAndSelect("cart.product", "product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("category.shop", "shop")
      .leftJoinAndSelect("cart.productInventory", "productInventory")
      .leftJoinAndSelect("cart.user", "user")
      .where("user.id = :id", { id: user.id })
      .andWhere("cart.isActive = :isActive", { isActive: true })
      .getMany();

    if (!cart) {
      throw new HttpException("Data not found", HttpStatus.BAD_REQUEST)
    }

    return cart;
  }

  async updateProductToCart(body: IKey) {

  }

  async deleteProductToCart(cartId: string) {
    const cart = await this.cartRepository.findOne({
      where: { id: +cartId }
    });

    if (!cart) {
      throw new HttpException("Data not found", HttpStatus.BAD_REQUEST)
    }

    await this.productInventoryService.updateProductInventoryQuantityInc({
      productId: cart.productId.toString(),
      quantityChange: cart.total.toString(),
      productInventoryId: cart.productInventoryId.toString()
    })

    await this.cartRepository.createQueryBuilder("cart")
      .update(Cart)
      .set({
        isActive: false
      })
      .where("id = :id", { id: +cartId })
      .execute();

    return {
      data: cart,
      status: HttpStatus.OK
    }
  }

  async removeCartOrder(cartId: number[]) {
    for (const cart of cartId) {
      const cartRepository = await this.cartRepository.findOne({
        where: { id: +cart }
      });

      if (!cartRepository) {
        throw new HttpException("Data not found", HttpStatus.BAD_REQUEST)
      }

      await this.cartRepository.createQueryBuilder("cart")
        .update(Cart)
        .set({
          isActive: false
        })
        .where("id = :id", { id: cart })
        .execute();


    }

  }

  async getShopByCartId(cartId: number) {
    const cart = await this.cartRepository.createQueryBuilder("cart")
      .leftJoinAndSelect("cart.product", "product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("category.shop", "shop")
      .leftJoinAndSelect("shop.user", "user")
      .select([
        'user.id as userId'
      ])
      .where("cart.id = :id", { id: cartId })
      .getRawOne();

    if (!cart) {
      throw new HttpException("Data not found", HttpStatus.BAD_REQUEST)
    }

    return cart;
  }
}
