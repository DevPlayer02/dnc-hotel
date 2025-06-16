import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.services';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async list() {
    return await this.userService.list();
  }

  @Get(':id')
  async show(@Param('id') id: string) {
    return await this.userService.show(id);
  }

  @Post()
  async createUser(@Body() body: any) {
    await this.userService.createUser(body);
  }
}
