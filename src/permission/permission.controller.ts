import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permission')
export class PermissionController {

	constructor(
		private readonly permissionService: PermissionService
	) { }

	@Post("/add-permission")
	addPermission(@Body() body: CreatePermissionDto) {
		return this.permissionService.addPermission(body);
	}
}
