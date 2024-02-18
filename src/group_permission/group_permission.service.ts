import { Injectable } from '@nestjs/common';
import { CreateGroupPermissionDto } from './dto/create-group_permission.dto';
import { UpdateGroupPermissionDto } from './dto/update-group_permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupPermission } from './entities/group_permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupPermissionService {
  constructor(
    @InjectRepository(GroupPermission)
    private readonly groupPermissionRepository: Repository<GroupPermission>,
  ) { }

  async create(createGroupPermissionDto: CreateGroupPermissionDto) {
    return 'This action adds a new groupPermission';
  }

}
