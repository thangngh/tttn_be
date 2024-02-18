import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AuthUser } from 'src/user/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { IKey } from 'src/auth/interface/auth.interface';
import { SharpPipe } from 'src/file/sharp.pipe';
import { JWTAuthGuard } from 'src/auth/strategy/jwt-auth.guard';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @UseGuards(JWTAuthGuard)
  @Post("add-review")
  @UseInterceptors(FilesInterceptor('image'))
  addReview(@AuthUser() user: User, @Body() body: IKey, @UploadedFiles(SharpPipe) multiFile: Array<Express.Multer.File>) {
    return this.reviewService.addReview(user, body, multiFile)
  }

  @Get("get-review-product/:productId")
  getReviewProduct(@Param('productId') productId: string) {
    return this.reviewService.getReviewProduct(productId)
  }

  @Get("group-by-rating-product/:productId")
  groupByRatingProduct(@Param('productId') productId: string) {
    return this.reviewService.groupByRatingProduct(productId)
  }

  @UseGuards(JWTAuthGuard)
  @Get("get-review-shop-product")
  getReviewProductShop(@AuthUser() user: User) {
    return this.reviewService.getReviewProductByShop(user)
  }
}
