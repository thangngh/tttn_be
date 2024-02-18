import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupPermissionService } from './group_permission.service';
import { CreateGroupPermissionDto } from './dto/create-group_permission.dto';
import { UpdateGroupPermissionDto } from './dto/update-group_permission.dto';

@Controller('group-permission')
export class GroupPermissionController {
  constructor(private readonly groupPermissionService: GroupPermissionService) { }


}
