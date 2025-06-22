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

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  controllers: [HotelsController],
  providers: [
    CreateHotelsService,
    FindAllHotelsService,
    FindOneHotelService,
    FindByNameHotelsService,
    FindByOwnerHotelsService,
    RemoveHotelService,
    UpdateHotelService,
    {
      provide: HOTEL_REPOSITORY_TOKEN,
      useClass: HotelsRepositories,
    },
  ],
})
export class HotelsModule {}
