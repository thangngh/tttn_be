import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JWTAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { AuthUser } from 'src/user/user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @UseGuards(JWTAuthGuard)
  @Post("/create-category")
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/get-all-category-shop")
  getCategoryByShopId(@AuthUser() user: User) {
    return this.categoryService.getCategoryByShopId(user);
  }

  @UseGuards(JWTAuthGuard)
  @Patch("/update-category/:id")
  updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Get("/get-all")
  getAllCategory() {
    return this.categoryService.getAllCategory();
  }

  @Get("/product-with-category")
  getProductWithCategory(@Query() query: { categoryName: string }) {
    return this.categoryService.findProductByCategory(query)
  }
}
