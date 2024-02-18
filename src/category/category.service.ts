import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, ILike, Not, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  async createCategory(body: CreateCategoryDto) {
    const { shopId, name } = body;
    // const findCategory = await this.categoryRepository.findOne({
    //   where: {
    //     shopId: Not(Equal(shopId))
    //   }
    // })

    // if (findCategory) {
    //   throw new HttpException("Some thing went wrong!", HttpStatus.BAD_REQUEST)
    // }

    const checkExistName = await this.categoryRepository.findOne({
      where: { name: name.trim(), shopId }
    })

    if (checkExistName) {
      throw new HttpException("Duplicate category name", HttpStatus.BAD_REQUEST)
    }

    const category = new Category(body)
    const createRepository = await this.categoryRepository.save({
      ...category,
      createAt: new Date,
      isActive: true
    })

    const categoriesRepository = await this.categoryRepository.findOne({
      where: { id: createRepository.id },
      relations: ["shop"]
    })

    return {
      status: HttpStatus.OK,
      message: "Create Category success",
      data: categoriesRepository
    }
  }

  async updateCategory(id: string, updateCategory: UpdateCategoryDto) {
    const { name, modifiedAt } = updateCategory

    const findCategory = await this.categoryRepository.findOne({
      where: { id: +id }
    })

    if (!findCategory) {
      throw new HttpException("Category not found", HttpStatus.NOT_FOUND)
    }

    const checkExistName = await this.categoryRepository.findOne({
      where: {
        name: name.trim(),
        shopId: findCategory.shopId,
        id: Not(Equal(+id))
      }
    })

    if (checkExistName) {
      throw new HttpException("Duplicate category name", HttpStatus.BAD_REQUEST)
    }

    const builder = await this.categoryRepository.createQueryBuilder("category")
      .update()
      .set({
        name,
        modifiedAt
      })
      .where("id = :id", { id: +id })
      .execute()

    const category = await this.categoryRepository.findOne({
      where: { id: +id },
      relations: ["shop"]
    })

    return {
      status: HttpStatus.OK,
      data: category,
      message: "Update category success"
    }
  }

  async deleteCategoryInShop(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id: +id },
    })

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND)
    }

    const builder = await this.categoryRepository.createQueryBuilder("category")
      .update()
      .set({
        isActive: false
      })
      .execute()

    return {
      status: HttpStatus.OK,
      data: category
    }

  }

  async getAllCategory() {
    const categories = await this.categoryRepository.find({
      relations: ["shop"],
      where: {
        isActive: true
      }
    })

    return {
      status: HttpStatus.OK,
      data: categories
    }
  }

  async findProductByCategory(query: { categoryName: string }) {
    if (!query.categoryName) {
      throw new HttpException("Wrong format", HttpStatus.BAD_REQUEST)
    }
    const { categoryName } = query
    const category = await this.categoryRepository.findOne({
      where: {
        name: ILike(`%${categoryName.trim()}%`),
        isActive: true
      },
    })


    return category
  }

  async getCategoryByShopId(user: User) {
    const { id } = user
    const categories = await this.categoryRepository.find({
      where: {
        shop: {
          userId: id
        },
        isActive: true
      },
      relations: ["shop"],
      order: {
        modifiedAt: 'DESC'
      }
    })

    return {
      status: HttpStatus.OK,
      data: categories
    }
  }

}
