import { Module } from '@nestjs/common';
import { UserPaymentService } from './user_payment.service';
import { UserPaymentController } from './user_payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserPayment } from './entities/user_payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserPayment])
  ],
  controllers: [UserPaymentController],
  providers: [UserPaymentService],
  exports: [UserPaymentService]
})
export class UserPaymentModule { }
