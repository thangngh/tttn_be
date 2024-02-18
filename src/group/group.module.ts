import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { User } from 'src/user/entities/user.entity';
import { GroupPermission } from 'src/group_permission/entities/group_permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, User, GroupPermission])
  ],
  controllers: [GroupController],
  providers: [GroupService]
})
export class GroupModule { }
