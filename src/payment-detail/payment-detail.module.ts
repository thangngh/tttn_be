import { Module } from '@nestjs/common';
import { PaymentDetailService } from './payment-detail.service';
import { PaymentDetailController } from './payment-detail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentDetailEntity } from './entities/payment-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentDetailEntity])
  ],
  controllers: [PaymentDetailController],
  providers: [PaymentDetailService]
})
export class PaymentDetailModule { }
