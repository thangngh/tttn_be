import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserPayment } from 'src/user_payment/entities/user_payment.entity';
import { UserAddress } from 'src/user_address/entities/user_address.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Group } from 'src/group/entities/group.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserGateWay } from './user.gateway';
import { Review } from 'src/review/entities/review.entity';
import { MessageModule } from 'src/message/message.module';
import { Order } from 'src/order/entities/order.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { ProductModule } from 'src/product/product.module';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserPayment,
      UserAddress,
      Shop,
      Role,
      Group,
      Review,
      Order,
      Notification
    ]),
    AuthModule,
    MessageModule,
    NotificationModule,
    ProductModule,
    CartModule
  ],
  controllers: [UserController],
  providers: [UserService, UserGateWay],
  exports: [UserService]
})
export class UserModule { }
