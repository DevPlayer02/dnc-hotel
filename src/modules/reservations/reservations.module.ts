import { Module } from '@nestjs/common';
import { ReservationsController } from './infra/reservations.controller';
import { CreateReservationsService } from './services/createReservations.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';
import { HotelsModule } from '../hotels/hotels.module';
import { REPOSITORY_TOKEN_RESERVATION } from './utils/repositoriesTokens';
import { ReservationRepositories } from './infra/reservations.repository';
import { HotelsRepositories } from '../hotels/infra/hotels.repository';
import { HOTEL_REPOSITORY_TOKEN } from '../hotels/utils/repositoriesTokens';

console.log('HOTEL_REPOSITORY_TOKEN ->', HOTEL_REPOSITORY_TOKEN);

@Module({
  imports: [PrismaModule, AuthModule, UserModule, HotelsModule],
  controllers: [ReservationsController],
  providers: [
    CreateReservationsService,
    {
      provide: REPOSITORY_TOKEN_RESERVATION,
      useClass: ReservationRepositories,
    },
    {
      provide: HOTEL_REPOSITORY_TOKEN,
      useClass: HotelsRepositories,
    },
  ],
})
export class ReservationsModule {}
