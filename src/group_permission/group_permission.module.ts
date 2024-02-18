import { Module } from '@nestjs/common';
import { GroupPermissionService } from './group_permission.service';
import { GroupPermissionController } from './group_permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupPermission } from './entities/group_permission.entity';
import { Permission } from 'src/permission/entities/permission.entity';
import { Group } from 'src/group/entities/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupPermission, Permission, Group])
  ],
  controllers: [GroupPermissionController],
  providers: [GroupPermissionService]
})
export class GroupPermissionModule { }
