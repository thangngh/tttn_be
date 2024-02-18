import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto, addImageUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) { }

export class updateImageUserDto extends PartialType(addImageUserDto) { }