import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { UserAddressService } from './user_address.service';
import { CreateUserAddressDto } from './dto/create-user_address.dto';
import { UpdateUserAddressDto } from './dto/update-user_address.dto';
import { AuthUser } from 'src/user/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { JWTAuthGuard } from 'src/auth/strategy/jwt-auth.guard';

@Controller('user-address')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) { }

  @UseGuards(JWTAuthGuard)
  @Post("/add-address-user")
  addUserAddress(@AuthUser() user: User, @Body() body: CreateUserAddressDto) {
    return this.userAddressService.addUserAddress(user, body);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/get-address-user")
  getUserAddress(@AuthUser() user: User) {
    return this.userAddressService.getUserAddress(user);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/get-one-address-user/:id")
  getOneUserAddress(@AuthUser() user: User, @Param("id") id: string) {
    return this.userAddressService.getOneUserAddress(user, id);
  }

  @UseGuards(JWTAuthGuard)
  @Patch("/select-default-address/:id")
  selectDefault(@AuthUser() user: User, @Param("id") id: string) {
    return this.userAddressService.selectDefaultAddress(user, id);
  }

  @UseGuards(JWTAuthGuard)
  @Delete("/delete-user-address/:id")
  deleteUserAddress(@AuthUser() user: User, @Param("id") id: string) {
    return this.userAddressService.deleteUserAddress(user, id);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/user-address-default")
  getUserAddressDefault(@AuthUser() user: User) {
    return this.userAddressService.getUserAddressDefault(user);
  }

  @UseGuards(JWTAuthGuard)
  @Put("/update-address/:id")
  updateUserAddress(@AuthUser() user: User, @Param("id") id: string, @Body() body: UpdateUserAddressDto) {
    return this.userAddressService.updateUserAddress(user, id, body);
  }
}
