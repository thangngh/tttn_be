import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserPaymentDto } from './dto/create-user_payment.dto';
import { UpdateUserPaymentDto } from './dto/update-user_payment.dto';
import { UserPayment } from './entities/user_payment.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class UserPaymentService {
  constructor(
    @InjectRepository(UserPayment)
    private readonly userPaymentRepository: Repository<UserPayment>,
  ) { }

  async addUserPayment(user: User, body: CreateUserPaymentDto) {
    const addUserPaymentRepository = await this.userPaymentRepository.save({
      ...body,
      userId: user.id
    })

    return {
      message: "Add user payment successfully!",
      data: addUserPaymentRepository,
    }
  }

  async getUserPayment(user: User) {
    const getUserPaymentRepository = await this.userPaymentRepository.find({
      where: {
        userId: user.id
      }
    })

    return {
      data: getUserPaymentRepository
    }
  }

  async getOneUserPayment(user: User, id: string) {
    const getOneUserPaymentRepository = await this.userPaymentRepository.findOne({
      where: {
        id: +id,
        userId: user.id
      }
    })

    if (!getOneUserPaymentRepository) {
      throw new HttpException("User payment not found!", HttpStatus.NOT_FOUND)
    }

    return {
      data: getOneUserPaymentRepository
    }
  }

  async updateUserPayment(user: User, id: string, body: UpdateUserPaymentDto) {
    const updateUserPaymentRepository = await this.userPaymentRepository.update({
      id: +id,
      userId: user.id
    }, {
      ...body
    })

    if (!updateUserPaymentRepository.affected) {
      throw new HttpException("User payment not found!", HttpStatus.NOT_FOUND)
    }

    return {
      message: "Update user payment successfully!",
      data: updateUserPaymentRepository
    }
  }

  async deleteUserPayment(user: User, id: string) {
    const deleteUserPaymentRepository = await this.userPaymentRepository.delete({
      id: +id,
      userId: user.id
    })

    if (!deleteUserPaymentRepository.affected) {
      throw new HttpException("User payment not found!", HttpStatus.NOT_FOUND)
    }

    return {
      message: "Delete user payment successfully!",
      data: deleteUserPaymentRepository
    }
  }



}
