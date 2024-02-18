import { Controller, Get, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JWTAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { AuthUser } from 'src/user/user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @UseGuards(JWTAuthGuard)
  @Get("/notification-shop")
  getNotification(@AuthUser() user: User) {
    return this.notificationService.getNotification(user);
  }
}
