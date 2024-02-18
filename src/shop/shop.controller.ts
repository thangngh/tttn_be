import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { AuthUser } from 'src/user/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { JWTAuthGuard } from 'src/auth/strategy/jwt-auth.guard';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) { }

  @UseGuards(JWTAuthGuard)
  @Post("/create-shop")
  create(@AuthUser() user: User, @Body() createShopDto: CreateShopDto) {
    return this.shopService.create(user, createShopDto);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/shop-by-user")
  getShopByUser(@AuthUser() user: User) {
    return this.shopService.getShopByUser(user);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/shop/:id")
  findOne(@Param('id') id: string) {
    return this.shopService.getShopById(id);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/is-shop")
  isShop(@AuthUser() user: User) {
    return this.shopService.isShop(user);
  }

}
