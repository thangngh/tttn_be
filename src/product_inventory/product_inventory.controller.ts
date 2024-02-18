import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ProductInventoryService } from './product_inventory.service';
import { CreateProductInventoryDto } from './dto/create-product_inventory.dto';
import { UpdateProductInventoryDto } from './dto/update-product_inventory.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SharpPipe } from 'src/file/sharp.pipe';
import { IKey } from 'src/auth/interface/auth.interface';

@Controller('product-inventory')
export class ProductInventoryController {
  constructor(private readonly productInventoryService: ProductInventoryService) { }

  @Post("/create-product-inventory")
  @UseInterceptors(FilesInterceptor('image'))
  createProductInventory(@Body() body: CreateProductInventoryDto, @UploadedFiles(SharpPipe) file: Array<Express.Multer.File>) {
    return this.productInventoryService.createProductInventory(body, file);
  }

  @Get("/get-one/:productInventory")
  getProductByNameAndInventory(@Param('productInventory') productInventory: string) {
    return this.productInventoryService.findProductAndProductInventory(productInventory);
  }

  // @Post("/update-quantity-inc")
  // updateProductInventoryQuantityInc(@Body() body: IKey) {
  //   return this.productInventoryService.updateProductInventoryQuantityInc(body);
  // }
}
