import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JWTAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { AuthUser } from 'src/user/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { PaginationDTO } from 'src/common/pagination/dto/paginationQuery-dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post("/create")
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/get-product/:productId")
  getProduct(@AuthUser() user: User, @Param('productId') productId: string) {
    return this.productService.getProduct(user, productId);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/get-all-product-with-shop")
  getAllProductWithShop(@AuthUser() user: User, @Query() query: PaginationDTO) {
    return this.productService.getAllProductWithShop(user, query);
  }

  @Get("/get-all-product")
  getAllProduct(@Query() query: PaginationDTO) {
    return this.productService.getAllProduct(query);
  }

  @UseGuards(JWTAuthGuard)
  @Patch("/update-product/:productId")
  update(@Param('productId') productId: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(productId, updateProductDto);
  }

  @UseGuards(JWTAuthGuard)
  @Delete("/delete-product/:productId")
  remove(@Param('productId') productId: string) {
    return this.productService.deleteProduct(productId);
  }

  @Get('get-image/:imgpath')
  async seenImage(@Param('imgpath') imgpath, @Res() res) {
    res.sendFile(imgpath, { root: './uploads' });
  }


  @Get("/get-shop/:shopId")
  getOneShop(@Param("shopId") shopId: string) {
    return this.productService.getProductWithShopId(shopId);
  }

  @Get("/product-in-month")
  getProductInMonth() {
    return this.productService.newProductInAMonth();
  }

  @Get("/product-with-category")
  getProductWithCategory(@Query() query: { categoryName: string }) {
    return this.productService.findProductByCategory(query)
  }

  @Get("/get-shop-productId/:productId")
  getShop(@Param("productId") productId: string) {
    return this.productService.getShopByProduct(productId);
  }


  @UseGuards(JWTAuthGuard)
  @Get("is-shop-owner-product/:productId")
  isShopOwnerProduct(@AuthUser() user: User, @Param("productId") productId: string) {
    return this.productService.shopIsOwnerOfProduct(user, productId);
  }
}
