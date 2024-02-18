import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>
  ) { }

  async create(createNotificationDto: CreateNotificationDto) {
    return await this.notificationRepository.save(createNotificationDto);
  }

  async getNotification(user: User) {
    const notification = await this.notificationRepository.createQueryBuilder("notification")
      .leftJoinAndSelect("notification.user", "user")
      .leftJoinAndSelect("user.shop", "shop")
      .where("notification.userId = :id", { id: user.id })
      .orderBy("notification.createdAt", "DESC")
      .getMany();

    return notification;
  }
}
