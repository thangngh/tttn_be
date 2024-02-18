import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductInventory } from 'src/product_inventory/entities/product_inventory.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Shop, Product, ProductInventory, User])
  ],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule { }
