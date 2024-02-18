import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile, Res, UploadedFiles } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JWTAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { AuthUser } from './user.decorator';
import { User } from './entities/user.entity';
import { PaginationDTO } from 'src/common/pagination/dto/paginationQuery-dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { SharpPipe } from 'src/file/sharp.pipe';
import { addUserToGroupDto } from './dto/add-user-to-group.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("user")
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get("/get-all")
  findAll(@Query() query: PaginationDTO) {
    return this.userService.findAll(query);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/profile")
  profile(@AuthUser() user: User) {
    return this.userService.profile(user);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/get-role")
  getRole(@AuthUser() user: User) {
    return this.userService.getRole(user);
  }

  @UseGuards(JWTAuthGuard)
  @Patch("/edit-profile")
  editProfile(@AuthUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.editProfile(user, updateUserDto);
  }

  @UseGuards(JWTAuthGuard)
  @Post("/upload-avatar")
  @UseInterceptors(FilesInterceptor('image'))
  uploadAvatar(@AuthUser() user: User, @UploadedFiles(SharpPipe) file: Array<Express.Multer.File>) {
    return this.userService.uploadAvatar(user, file);
  }

  @Get('get-image/:imgpath')
  async seenImage(@Param('imgpath') imgpath, @Res() res) {
    res.sendFile(imgpath, { root: './uploads' });
  }

  @UseGuards(JWTAuthGuard)
  @Post("/add-user-to-group")
  addUserToGroup(@AuthUser() user: User, @Body() addUserToGroupDto: addUserToGroupDto) {
    return this.userService.addUserToGroup(user, addUserToGroupDto);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/get-total-user")
  getTotalUser(@AuthUser() user: User) {
    return this.userService.getTotalUser(user);
  }
}