import { Module } from '@nestjs/common';
import { UserController } from './user.controllers';
import { UserService } from './user.services';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
