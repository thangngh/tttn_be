import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from 'src/user/entities/user.entity';
import { IKey } from 'src/auth/interface/auth.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) { }

  async addReview(user: User, body: IKey, multiFile: Array<Express.Multer.File>) {
    const { productId, rating, content } = body
    const comment = {
      content,
      lists: multiFile ? multiFile.map(file => file) as unknown as string : null,
      createdAt: new Date(),
    }

    const review = new Review({
      userId: user.id,
      productId: +productId,
      rating: +rating,
      comment,
      createdAt: new Date(),
      isDeleted: false
    })
    const reviewRepository = await this.reviewRepository.save(review)
    return {
      status: HttpStatus.OK,
      message: 'add review success',
      data: reviewRepository
    }
  }

  async getReviewProduct(productId: string) {
    const review = await this.reviewRepository.createQueryBuilder("review")
      .leftJoinAndSelect("review.user", "user")
      .leftJoinAndSelect("review.product", "product")
      .leftJoinAndSelect("product.category", 'category')
      .leftJoinAndSelect("category.shop", 'shop')
      .where("review.productId = :productId", { productId })
      .andWhere("review.isDeleted = :isDeleted", { isDeleted: false })
      .orderBy("review.createdAt", "DESC")
      .limit(5)
      .getMany()

    if (!review) {
      throw new HttpException("Not found", HttpStatus.BAD_REQUEST)
    }

    return {
      status: HttpStatus.OK,
      data: review
    }
  }

  async groupByRatingProduct(productId: string) {
    const review = await this.reviewRepository.createQueryBuilder("review")
      .select("review.rating", "rating")
      .addSelect("COUNT(review.rating)", "count")
      .where("review.productId = :productId", { productId })
      .groupBy("review.rating")
      .getRawMany()

    if (!review) {
      throw new HttpException("Not found", HttpStatus.BAD_REQUEST)
    }

    const avg = await this.reviewRepository.createQueryBuilder("review")
      .select("AVG(review.rating)", "avg")
      .where("review.productId = :productId", { productId })
      .getRawOne();



    const data = [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 0 },
      { rating: 4, count: 0 },
      { rating: 5, count: 0 },
    ]

    review.forEach(item => {
      data[item.rating - 1] = item
    })

    return {
      status: HttpStatus.OK,
      data: {
        dataRate: data,
        avg: avg.avg
      }
    }
  }

  async getReviewProductByShop(user: User) {
    const review = await this.reviewRepository.createQueryBuilder("review")
      .leftJoinAndSelect("review.user", "user")
      .leftJoinAndSelect("review.product", "product")
      .leftJoinAndSelect("product.category", 'category')
      .leftJoinAndSelect("category.shop", 'shop')
      .where("shop.userId = :userId", { userId: user.id })
      .orderBy("review.createdAt", "DESC")
      .getMany()

    if (!review) {
      throw new HttpException("Not found", HttpStatus.BAD_REQUEST)
    }

    return {
      status: HttpStatus.OK,
      data: review
    }
  }

}
