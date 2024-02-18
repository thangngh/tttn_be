import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) { }


  async generateRoomId() {
    return crypto.randomBytes(12).toString('hex');
  }

  async createRoomMessage(create: CreateMessageDto) {
    const { fromId, toId, content = 'Hi!' } = create;
    const generateRoomId = await this.generateRoomId();

    const message = new Message({
      roomId: generateRoomId,
      fromId,
      toId,
      content,
      createdAt: new Date()
    })

    return await this.messageRepository.save(message);
  }

  async saveMessage(roomId: string, body: CreateMessageDto) {
    console.log(body, roomId)
    const { fromId, toId, content = '' } = body;

    const message = new Message({
      fromId,
      toId,
      content,
      createdAt: new Date()
    })

    return await this.messageRepository.save({
      roomId: roomId,
      ...message,
    });
  }

  async getMessageInRoom(roomId: string) {
    const messageInRoom = await this.messageRepository.createQueryBuilder("message")
      .leftJoinAndSelect("message.from", "from")
      .leftJoinAndSelect("message.to", "to")
      .where("message.roomId = :roomId", { roomId: (roomId as any).roomId })
      .orderBy("message.createdAt", "ASC")
      .groupBy("message.roomId")
      .addGroupBy("message.from")
      .addGroupBy("message.to")
      .addGroupBy("message.content")
      .addGroupBy("message.created_at")
      .select("message.room_id as roomId")
      .addSelect("message.from as from")
      .addSelect("message.to as to")
      .addSelect("message.content as content")
      .addSelect("message.created_at as createAt")
      .getRawMany();

    return messageInRoom;
  }

  async getRoomWithUser(user: User, roomId: string) {
    const roomWithUser = await this.messageRepository.createQueryBuilder("message")
      .leftJoinAndSelect("message.from", "from")
      .leftJoinAndSelect("message.to", "to")
      .where("message.fromId = :fromId", { fromId: user.id })
      .orWhere("message.toId = :toId", { toId: user.id })
      .where("message.roomId = :roomId", { roomId: (roomId as any).roomId })
      .orderBy("message.createdAt", "ASC")
      // .groupBy("message.roomId")
      // .addGroupBy("message.from")
      // .addGroupBy("message.to")
      // .addGroupBy("message.content")
      // .addGroupBy("message.created_at")
      // .select("message.room_id as roomId")
      // .addSelect("message.from as from")
      // .addSelect("message.to as to")
      // .addSelect("message.content as content")
      // .addSelect("message.created_at as createAt")
      .getMany();

    return roomWithUser;
  }

  async getMessageRoomWithUser(user: User) {
    const roomWithUser = await this.messageRepository.createQueryBuilder("message")
      .leftJoinAndSelect("message.from", "from")
      .leftJoinAndSelect("message.to", "to")
      .where("message.fromId = :fromId", { fromId: user.id })
      .orWhere("message.toId = :toId", { toId: user.id })
      .orderBy("message.createdAt", "DESC")
      // .groupBy("message.roomId")
      // .addGroupBy("message.from")
      // .addGroupBy("message.to")
      // .addGroupBy("message.content")
      // .addGroupBy("message.created_at")
      // .select("message.room_id as roomId")
      // .addSelect("message.from as from")
      // .addSelect("message.to as to")
      // .addSelect("message.content as content")
      // .addSelect("message.created_at as createAt")
      .getMany();

    return roomWithUser;
  }
}
