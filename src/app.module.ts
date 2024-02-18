import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GroupModule } from './group/group.module';
import { CategoryModule } from './category/category.module';
import { DiscountModule } from './discount/discount.module';
import { GroupPermissionModule } from './group_permission/group_permission.module';
import { PermissionModule } from './permission/permission.module';
import { OrderModule } from './order/order.module';
import { ShopModule } from './shop/shop.module';
import { UserAddressModule } from './user_address/user_address.module';
import { UserPaymentModule } from './user_payment/user_payment.module';
import { CartModule } from './cart/cart.module';
import { ProductModule } from './product/product.module';
import { ProductInventoryModule } from './product_inventory/product_inventory.module';
import 'dotenv/config';
import { RolesModule } from './roles/roles.module';
import { EmailModule } from './email/email.module';
import { FileModule } from './file/file.module';
import { ReviewModule } from './review/review.module';
import { PaymentDetailModule } from './payment-detail/payment-detail.module';
import { PageVisitModule } from './page-visit/page-visit.module';
import { MessageModule } from './message/message.module';
import { NotificationModule } from './notification/notification.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    DatabaseModule,
    RolesModule,
    UserModule,
    AuthModule,
    GroupModule,
    CategoryModule,
    DiscountModule,
    GroupPermissionModule,
    PermissionModule,
    OrderModule,
    ShopModule,
    UserAddressModule,
    UserPaymentModule,
    CartModule,
    ProductModule,
    ProductInventoryModule,
    EmailModule,
    FileModule,
    ReviewModule,
    PaymentDetailModule,
    PageVisitModule,
    MessageModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
