import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from '../domain/dto/createReservation.dto';
import { REPOSITORY_TOKEN_RESERVATION } from '../utils/repositoriesTokens';
import { IReservationRepository } from '../domain/repositories/IReservations.repositories';
import { differenceInDays, parseISO } from 'date-fns';
import { IHotelRepository } from 'src/modules/hotels/domain/repositories/IHotel.repositories';
import { ReservationStatus } from 'generated/prisma';
import { HOTEL_REPOSITORY_TOKEN } from 'src/modules/hotels/utils/repositoriesTokens';

console.log('HOTEL_REPOSITORY_TOKEN ->', HOTEL_REPOSITORY_TOKEN);

@Injectable()
export class CreateReservationsService {
  constructor(
    @Inject(REPOSITORY_TOKEN_RESERVATION)
    private readonly reservationRepository: IReservationRepository,
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelsRepository: IHotelRepository,
  ) {}

  async create(id: number, data: CreateReservationDto) {
    const checkInDate = parseISO(data.checkIn);
    const checkOutDate = parseISO(data.checkOut);
    const daysOfStay = differenceInDays(checkInDate, checkOutDate);

    if (checkInDate >= checkOutDate) {
      throw new BadRequestException(
        'Check-out date must be after check-in date.',
      );
    }

    const hotel = await this.hotelsRepository.findHotelById(data.hotelId);

    if (!hotel) {
      throw new NotFoundException('Hotel not found.');
    }

    if (typeof hotel.price !== 'number' || hotel.price <= 0) {
      throw new BadRequestException('Invalid hotel price');
    }

    const total = daysOfStay * hotel.price;

    const newReservation = {
      ...data,
      checkIn: checkInDate.toISOString(),
      checkOut: checkOutDate.toISOString(),
      total,
      userId: id,
      status: ReservationStatus.PENDING,
    };

    return this.reservationRepository.create(newReservation);
  }
}
