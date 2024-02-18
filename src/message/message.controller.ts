import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JWTAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { AuthUser } from 'src/user/user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @Post("/create-room")
  createRoomMessage(@Body() body: CreateMessageDto) {
    return this.messageService.createRoomMessage(body);
  }

  @Post("/save-message/:roomId")
  saveMessage(@Param() roomId: string, @Body() body: CreateMessageDto) {
    return this.messageService.saveMessage(roomId, body);
  }

  @Get("/message-room/:roomId")
  getMessageInRoom(@Param() roomId: string) {
    return this.messageService.getMessageInRoom(roomId);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/message-room-user/:roomId")
  getMessageUser(@AuthUser() user: User, @Param() roomId: string) {
    return this.messageService.getRoomWithUser(user, roomId);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/message-user")
  getMessageUserWithUser(@AuthUser() user: User) {
    return this.messageService.getMessageRoomWithUser(user)
  }

}
