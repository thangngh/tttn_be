import { Module } from '@nestjs/common';
import { ProductInventoryService } from './product_inventory.service';
import { ProductInventoryController } from './product_inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductInventory } from './entities/product_inventory.entity';
import { Product } from 'src/product/entities/product.entity';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductInventory, Product]),
    FileModule
  ],
  controllers: [ProductInventoryController],
  providers: [ProductInventoryService],
  exports: [ProductInventoryService]
})
export class ProductInventoryModule { }
