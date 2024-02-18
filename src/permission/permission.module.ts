import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { GroupPermission } from 'src/group_permission/entities/group_permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission, GroupPermission])
  ],
  controllers: [PermissionController],
  providers: [PermissionService]
})
export class PermissionModule { }
