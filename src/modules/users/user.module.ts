import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controllers';
import { UserService } from './user.services';
import { PrismaModule } from '../prisma/prisma.module';
import { UserIdCheckMiddleware } from 'src/shared/middlewares/userIdCheck.middleware';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${uuidv4()}${file.originalname}`;
          return cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserIdCheckMiddleware)
      .forRoutes(
        { path: 'users/:id', method: RequestMethod.GET },
        { path: 'users/:id', method: RequestMethod.PATCH },
        { path: 'users/:id', method: RequestMethod.DELETE },
      );
  }
}
