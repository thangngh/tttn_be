import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupPermissionDto } from './create-group_permission.dto';

export class UpdateGroupPermissionDto extends PartialType(CreateGroupPermissionDto) {}
