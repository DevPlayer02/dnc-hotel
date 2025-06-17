import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.services';
import { CreateUserDTO } from './domain/dto/createUser.dto';
import { UpdateUserDTO } from './domain/dto/updateUser.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  list() {
    return this.userService.list();
  }

  @Get(':id')
  show(@Param('id', ParseIntPipe) id: number) {
    return this.userService.show(id);
  }

  @Post()
  createUser(@Body() body: CreateUserDTO) {
    return this.userService.create(body);
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDTO,
  ) {
    return this.userService.update(id, body);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
