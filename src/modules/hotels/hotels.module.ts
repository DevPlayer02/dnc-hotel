import { Module } from '@nestjs/common';
import { CreateHotelsService } from './services/createHotel.service';
import { FindAllHotelsService } from './services/findAllHotel.service';
import { FindOneHotelService } from './services/findOneHotel.service';
import { RemoveHotelService } from './services/removeHotel.service';
import { UpdateHotelService } from './services/updateHotel.service';
import { HotelsRepositories } from './infra/hotels.repository';
import { HotelsController } from './infra/hotels.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { HOTEL_REPOSITORY_TOKEN } from './utils/repositoriesTokens';
import { FindByNameHotelsService } from './services/findByNameHotel.service';
import { FindByOwnerHotelsService } from './services/findByOwnerHotel.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { UploadHotelImageService } from './services/uploadHotelImage.service';

console.log(
  'HOTEL_REPOSITORY_TOKEN (hotels.module) ->',
  HOTEL_REPOSITORY_TOKEN,
);

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads-hotel',
        filename: (req, file, cb) => {
          const filename = `${uuidv4()}${file.originalname}`;
          return cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [HotelsController],
  providers: [
    CreateHotelsService,
    FindAllHotelsService,
    FindOneHotelService,
    FindByNameHotelsService,
    FindByOwnerHotelsService,
    RemoveHotelService,
    UpdateHotelService,
    UploadHotelImageService,
    {
      provide: HOTEL_REPOSITORY_TOKEN,
      useClass: HotelsRepositories,
    },
  ],
  exports: [
    {
      provide: HOTEL_REPOSITORY_TOKEN,
      useClass: HotelsRepositories,
    },
  ],
})
export class HotelsModule {}
