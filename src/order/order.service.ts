import { Injectable, HttpException, HttpStatus, ForbiddenException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CartService } from 'src/cart/cart.service';
import { UserService } from 'src/user/user.service';
import { ETime, IStatus } from './interface/order.interface';
import { IKey } from 'src/auth/interface/auth.interface';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly cartServicer: CartService,
    private readonly userServicer: UserService
  ) { }

  async createOrder(user: User, body: CreateOrderDto) {
    const { cartId, userAddressId } = body;
    const data: any[] = []
    for (const cart of cartId) {
      const order = this.orderRepository.create({
        cartId: cart,
        userAddressId: userAddressId,
        userId: user.id,
        status: 'pending'
      });
      const saveOrder = await this.orderRepository.createQueryBuilder("order")
        .insert()
        .into(Order)
        .values(order)
        .execute()

      data.push(saveOrder)
    }
    await this.cartServicer.removeCartOrder(cartId)

    return data
  }

  async shopApprovedOrder(user: User, orderId: string) {
    const order = await this.orderRepository.findOne({ where: { id: +orderId } });

    if (!order) {
      throw new HttpException("data not found", HttpStatus.BAD_REQUEST)
    }

    order.status = "approved by shop";

    return await this.orderRepository.save(order);
  }

  async shopRejectOrder(user: User, orderId: string) {
    const order = await this.orderRepository.findOne({ where: { id: +orderId } });

    if (!order) {
      throw new HttpException("data not found", HttpStatus.BAD_REQUEST)
    }
    order.status = "rejected by shop";

    return await this.orderRepository.save(order);

  }

  async getOrderUser(user: User, status: string) {
    const order = await this.orderRepository.createQueryBuilder("order")
      .leftJoinAndSelect("order.user", "user")
      .leftJoinAndSelect("order.cart", "cart")
      .leftJoinAndSelect("order.userAddress", "userAddress")
      .leftJoinAndSelect("cart.product", "product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("category.shop", "shop")
      .leftJoinAndSelect("cart.productInventory", "productInventory")
      .where("order.userId = :userId", { userId: user.id })
    IStatus[status] && order.andWhere("order.status = :status", { status: IStatus[status] })

    const orderRepository = await order.getMany()

    if (!orderRepository) {
      throw new HttpException("data not found", HttpStatus.BAD_REQUEST)
    }

    return orderRepository;
  }

  async getOrderShop(user: User) {
    const order = await this.orderRepository.createQueryBuilder("order")
      .leftJoinAndSelect("order.user", "user")
      .leftJoinAndSelect("order.cart", "cart")
      .leftJoinAndSelect("order.userAddress", "userAddress")
      .leftJoinAndSelect("cart.product", "product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("category.shop", "shop")
      .leftJoinAndSelect("cart.productInventory", "productInventory")
      .where("shop.userId = :userId", { userId: user.id })
      .getMany()


    return order;
  }

  async approvedOrder(user: User, orderId: string) {
    const order = await this.orderRepository.findOne({ where: { id: +orderId } });
    if (!order) {
      throw new HttpException("data not found", HttpStatus.BAD_REQUEST)
    }

    order.status = "approved";

    return await this.orderRepository.save(order);
  }

  async rejectOrder(user: User, orderId: string) {
    const order = await this.orderRepository.findOne({ where: { id: +orderId } });

    if (!order) {
      throw new HttpException("data not found", HttpStatus.BAD_REQUEST)
    }

    order.status = "rejected";

    return await this.orderRepository.save(order);
  }

  async getTotalOrder(user: User) {
    const getRole = await this.userServicer.getRole(user)

    if (getRole.data !== 'ADMIN') {
      throw new ForbiddenException()
    }

    const order = await this.orderRepository.createQueryBuilder("order")
      .select("*")
      .getCount()

    return {
      data: order
    };
  }

  async getTotalOrderShop(user: User) {
    const order = await this.orderRepository.createQueryBuilder("order")
      .leftJoinAndSelect("order.cart", "cart")
      .leftJoinAndSelect("cart.product", "product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("category.shop", "shop")
      .where("shop.userId = :userId", { userId: user.id })
      .getCount()

    return {
      data: order
    };
  }

  async getTotalFinanceShop(user: User) {
    const orders = await this.orderRepository.createQueryBuilder("order")
      .leftJoinAndSelect("order.cart", "cart")
      .leftJoinAndSelect("cart.product", "product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("category.shop", "shop")
      .where("shop.userId = :userId", { userId: user.id })
      .andWhere("order.status = :status", { status: 'approved' })
      .getMany()
    let finance = 0;
    for (const order of orders) {
      const { price } = order.cart;
      finance += price;
    }
    return finance;
  }

  async getFullNameUserOrder(user: User) {
    const orders = await this.orderRepository.createQueryBuilder("order")
      .leftJoinAndSelect("order.user", "user")
      .leftJoinAndSelect("order.cart", "cart")
      .leftJoinAndSelect("cart.product", "product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("category.shop", "shop")
      .select([
        'user.firstName',
        "user.lastName",
        "order.createAt"
      ])
      .andWhere("shop.userId = :id", { id: user.id })
      .orderBy("order.createAt", 'DESC')
      .getMany()

    return orders
  }

  async getTotalOrderRejectedInMonth(user: User, body: any) {
    const { MONTH, YEAR } = body;
    const orders = await this.orderRepository.createQueryBuilder("order")
      .leftJoinAndSelect("order.cart", "cart")
      .leftJoinAndSelect("cart.product", "product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("category.shop", "shop")
      .groupBy("to_char(order.createAt, 'Month')")
      .addGroupBy("EXTRACT(YEAR FROM order.createAt) ")
      .select(MONTH === ETime[MONTH] ? "trim(to_char(order.createAt, 'Month')) as month" : "EXTRACT(YEAR FROM order.createAt) as year")
      .addSelect(
        'COUNT(CASE WHEN order.status = :status1 THEN 1 END)',
        'rejected',
      )
      .addSelect('COUNT(CASE WHEN order.status = :status2 THEN 1 END)', 'approved')
      .setParameters({
        status1: 'rejected',
        status2: 'approved',
      })
      .andWhere("shop.userId = :id", { id: user.id })
      .getRawMany()

    return orders
  }

}
