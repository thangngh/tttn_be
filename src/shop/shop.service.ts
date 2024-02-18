import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Not, Repository } from 'typeorm';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Shop } from './entities/shop.entity';
import { ICreateShop } from './interface/shop.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService
  ) { }

  async create(user: User, body: ICreateShop) {
    const { id } = user;

    const findUser = await this.shopRepository.findOne({
      relations: ["user"],
      where: {
        userId: id,
      }
    })

    if (findUser) {
      return findUser
    }
    await this.userService.becomeShopper(user)
    const shop = new Shop(body)

    const shopRepository = await this.shopRepository.save({
      ...shop,
      isActive: true,
      userId: id
    })

    return {
      message: "Create shop success",
      data: shopRepository
    }
  }

  async getShopByUser(user: User) {
    const { id, username } = user;
    const findShopByUser = await this.shopRepository.createQueryBuilder("shop")
      .leftJoinAndSelect("shop.user", "user")
      .where("user.id = :id", { id })
      .getOne()

    if (!findShopByUser)
      throw new HttpException(`User ${username} not found shop`, HttpStatus.BAD_REQUEST)

    return {
      status: "Get shop by user success",
      data: findShopByUser
    }
  }

  async getShopById(shopId: string) {
    const findShopById = await this.shopRepository.createQueryBuilder("shop")
      .leftJoinAndSelect("shop.user", "user")
      .where("shop.id = :id", { id: shopId })
      .getOne()

    if (!findShopById)
      throw new HttpException(`Shop not found`, HttpStatus.BAD_REQUEST)

    return {
      status: `Get shop by ${shopId} success`,
      data: findShopById
    }
  }



  async isShop(user: User) {
    const { id } = user;
    const findShop = await this.shopRepository.findOne({
      relations: ["user"],
      where: {
        userId: id,
      }
    })

    return !!findShop
  }
}
