import { Reservation } from 'generated/prisma';
import { CreateReservationDto } from '../dto/createReservation.dto';

export interface IReservationRepository {
  create(data: CreateReservationDto): Promise<Reservation>;
  //findbyId(id: number): Promise<Reservation>;
}
