import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JWTAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { AuthUser } from 'src/user/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { IStatus } from './interface/order.interface';
import { IKey } from 'src/auth/interface/auth.interface';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @UseGuards(JWTAuthGuard)
  @Post("/create-order")
  create(@AuthUser() user: User, @Body() body: CreateOrderDto) {
    return this.orderService.createOrder(user, body);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/get-order-user/:status")
  getOrder(@AuthUser() user: User, @Param('status') status: string) {
    return this.orderService.getOrderUser(user, status);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/get-order-shop")
  getOrderShop(@AuthUser() user: User) {
    return this.orderService.getOrderShop(user)
  }

  @UseGuards(JWTAuthGuard)
  @Patch("/approved-order/:orderId")
  approvedOrder(@AuthUser() user: User, @Param("orderId") orderId: string) {
    return this.orderService.approvedOrder(user, orderId);
  }

  @UseGuards(JWTAuthGuard)
  @Patch("/reject-order/:orderId")
  rejectOrder(@AuthUser() user: User, @Param("orderId") orderId: string) {
    return this.orderService.rejectOrder(user, orderId);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/total-order")
  totalOrder(@AuthUser() user: User) {
    return this.orderService.getTotalOrder(user);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/total-order-shop")
  totalOrderShop(@AuthUser() user: User) {
    return this.orderService.getTotalOrderShop(user);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/total-finance-shop")
  totalFinanceShop(@AuthUser() user: User) {
    return this.orderService.getTotalFinanceShop(user);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/user-order-product-in-shop")
  userOrderProductInShop(@AuthUser() user: User) {
    return this.orderService.getFullNameUserOrder(user);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/total-group-reject-approved/:time")
  getTotalOrderRejectedInMonth(@AuthUser() user: User, @Param('time') time: any) {
    return this.orderService.getTotalOrderRejectedInMonth(user, time);
  }

  @UseGuards(JWTAuthGuard)
  @Post("/reject-order-by-shop/:orderId")
  rejectOrderByShop(@AuthUser() user: User, @Param("orderId") orderId: string) {
    return this.orderService.shopRejectOrder(user, orderId);
  }

  @UseGuards(JWTAuthGuard)
  @Post("/approved-order-by-shop/:orderId")
  approvedOrderByShop(@AuthUser() user: User, @Param("orderId") orderId: string) {
    return this.orderService.shopApprovedOrder(user, orderId);
  }
}
