import { Controller, Get, UseGuards, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserPaymentService } from './user_payment.service';
import { CreateUserPaymentDto } from './dto/create-user_payment.dto';
import { UpdateUserPaymentDto } from './dto/update-user_payment.dto';
import { JWTAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { AuthUser } from 'src/user/user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('user-payment')
export class UserPaymentController {
  constructor(private readonly userPaymentService: UserPaymentService) { }

  @UseGuards(JWTAuthGuard)
  @Post("/add-user-payment")
  async addUserPayment(@AuthUser() user: User, @Body() body: CreateUserPaymentDto) {
    return await this.userPaymentService.addUserPayment(user, body)
  }

}
