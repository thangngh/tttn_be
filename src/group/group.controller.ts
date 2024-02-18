import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) { }


  @Post("/add-group")
  async addGroup(@Body() body: CreateGroupDto) {
    return await this.groupService.addGroup(body);
  }
}
