import { Module } from '@nestjs/common';
import { PageVisitService } from './page-visit.service';
import { PageVisitController } from './page-visit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageVisit } from './entites/page-visit.entity';
import { Shop } from 'src/shop/entities/shop.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PageVisit, Shop])
  ],
  controllers: [PageVisitController],
  providers: [PageVisitService],
  exports: [PageVisitService]
})
export class PageVisitModule { }
