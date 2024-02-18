import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserAddressDto } from './dto/create-user_address.dto';
import { UpdateUserAddressDto } from './dto/update-user_address.dto';
import { UserAddress } from './entities/user_address.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddress)
    private readonly userAddressRepository: Repository<UserAddress>,
  ) { }

  async addUserAddress(user: User, body: CreateUserAddressDto) {
    const { id } = user;

    const addUserAddressRepository = await this.userAddressRepository.save({
      ...body,
      userId: id
    })

    if (!addUserAddressRepository) {
      throw new HttpException("Some thing went wrong!", HttpStatus.BAD_REQUEST)
    }

    return {
      message: "Add user address successfully!",
      data: addUserAddressRepository,
    }
  }

  async getUserAddress(user: User) {
    const { id } = user;

    const getUserAddressRepository = await this.userAddressRepository.find({
      where: {
        userId: id
      },
      relations: ["user"]
    })

    return {
      data: getUserAddressRepository
    }
  }

  async getOneUserAddress(user: User, id: string) {
    const { id: userId } = user;

    const getOneUserAddressRepository = await this.userAddressRepository.findOne({
      where: {
        id: +id,
        userId
      }
    })

    if (!getOneUserAddressRepository) {
      throw new HttpException("User address not found!", HttpStatus.NOT_FOUND)
    }

    return {
      data: getOneUserAddressRepository
    }
  }

  async updateUserAddress(user: User, addressId: string, body: UpdateUserAddressDto) {
    const { id } = user;

    const AddressRepository = await this.userAddressRepository.findOne({
      where: {
        id: +addressId,
        userId: id
      }
    })

    if (!AddressRepository) {
      throw new HttpException("User address not found!", HttpStatus.NOT_FOUND)
    }

    const updateUserAddressRepository = await this.userAddressRepository.save({
      ...AddressRepository,
      ...body
    })

    if (!updateUserAddressRepository) {
      throw new HttpException("Some thing went wrong!", HttpStatus.BAD_REQUEST)
    }

    return {
      message: "Update user address successfully!",
      data: updateUserAddressRepository
    }
  }

  async selectDefaultAddress(user: User, addressId: string) {
    const { id } = user

    await this.userAddressRepository.createQueryBuilder("user-address")
      .update(UserAddress)
      .set({
        isDefault: false
      })
      .where("userId = :userId", { userId: id })
      .execute()

    const AddressRepository = await this.userAddressRepository.findOne({
      where: {
        id: +addressId,
        userId: id,
      }
    })

    if (!AddressRepository) {
      throw new HttpException("User address not found!", HttpStatus.NOT_FOUND)
    }

    const updateUserAddressRepository = await this.userAddressRepository.save({
      id: +addressId,
      isDefault: true
    })

    if (!updateUserAddressRepository) {
      throw new HttpException("Some thing went wrong!", HttpStatus.BAD_REQUEST)
    }

    return {
      message: "Select default address successfully!",
      data: updateUserAddressRepository
    }
  }

  async deleteUserAddress(user: User, UserAddressId: string) {
    const { id } = user;

    const checkAddressIsDefault = await this.userAddressRepository.findOne({
      where: {
        id: +UserAddressId,
        userId: id,
        isDefault: true
      }
    })

    if (checkAddressIsDefault) {
      throw new HttpException("Can't delete default address!", HttpStatus.BAD_REQUEST)
    }

    const getData = await this.userAddressRepository.findOne({
      where: {
        id: +UserAddressId,
        userId: id
      }
    })

    const deleteUserAddressRepository = await this.userAddressRepository.delete({
      id: +UserAddressId,
      userId: id
    })

    if (!deleteUserAddressRepository) {
      throw new HttpException("Some thing went wrong!", HttpStatus.BAD_REQUEST)
    }

    return {
      message: "Delete user address successfully!",
      data: getData
    }
  }

  async getUserAddressDefault(user: User) {
    const { id } = user;

    const getUserAddressDefaultRepository = await this.userAddressRepository.findOne({
      where: {
        userId: id,
        isDefault: true
      },
      relations: ['user']
    })

    if (!getUserAddressDefaultRepository) {
      throw new HttpException("User address not found!", HttpStatus.NOT_FOUND)
    }

    return {
      data: getUserAddressDefaultRepository
    }
  }
}
