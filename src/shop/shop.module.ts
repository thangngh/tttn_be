import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Shop } from './entities/shop.entity';
import { UserModule } from 'src/user/user.module';
import { PageVisit } from 'src/page-visit/entites/page-visit.entity';
import { HttpLoggerMiddleware } from './middleware/shop.middleware';
import { PageVisitModule } from 'src/page-visit/page-visit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Shop, PageVisit]),
    UserModule,
    PageVisitModule
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService]
})
export class ShopModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggerMiddleware)
      .exclude("shop")
      .forRoutes({
        path: '**',
        method: RequestMethod.GET
      });
  }
}
