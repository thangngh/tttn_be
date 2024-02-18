import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JWTAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { AuthUser } from 'src/user/user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @UseGuards(JWTAuthGuard)
  @Post("/add-cart")
  addProductToCart(@Body() body: CreateCartDto) {
    return this.cartService.addProductToCart(body);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/get-cart")
  findAllProductCartUser(@AuthUser() user: User) {
    return this.cartService.findAllProductCartUser(user);
  }

  @UseGuards(JWTAuthGuard)
  @Delete("/delete-cart/:cartId")
  removeProductCart(@Param('cartId') cartId: string) {
    return this.cartService.deleteProductToCart(cartId);
  }
}
