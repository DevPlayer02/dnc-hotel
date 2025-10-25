import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.services';
import { CreateUserDTO } from './domain/dto/createUser.dto';
import { UpdateUserDTO } from './domain/dto/updateUser.dto';
import { ParamId } from 'src/shared/decorators/paramId.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { User } from 'src/shared/decorators/user.decorator';
import { Role, User as UserType } from '@prisma/client';
import { Roles } from 'src/shared/decorators/roles.decorators';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { UserMatchGuard } from 'src/shared/guards/userMatch.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadPipe } from 'src/shared/pipes/fileValidation.pipe';

@UseGuards(AuthGuard, RoleGuard, ThrottlerGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  list(@User() user: UserType) {
    console.log(user);
    return this.userService.list();
  }

  @Get(':id')
  show(@ParamId() id: number) {
    return this.userService.show(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  createUser(@Body() body: CreateUserDTO) {
    console.log('>>> raw body (req.body):', body);
    console.log('>>> typeof email:', typeof body?.email, 'value:', body?.email);
    return this.userService.create(body);
  }

  @UseGuards(UserMatchGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Patch(':id')
  updateUser(@ParamId() id: number, @Body() body: UpdateUserDTO) {
    return this.userService.update(id, body);
  }

  @UseGuards(UserMatchGuard)
  @Delete(':id')
  deleteUser(@ParamId() id: number) {
    return this.userService.delete(id);
  }

  @UseInterceptors(FileInterceptor('avatar'))
  @Post('avatar')
  uploadAvatar(
    @User('id') id: number,
    @UploadedFile(new FileUploadPipe())
    avatar: Express.Multer.File,
  ) {
    return this.userService.uploadAvatar(id, avatar.filename);
  }
}
