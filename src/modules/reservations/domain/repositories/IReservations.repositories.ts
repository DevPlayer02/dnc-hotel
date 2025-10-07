import { Reservation, ReservationStatus } from '@prisma/client';
import { CreateReservationDto } from '../dto/createReservation.dto';

export interface IReservationRepository {
  create(data: CreateReservationDto): Promise<Reservation>;
  findbyId(id: number): Promise<Reservation | null>;
  findAll(): Promise<Reservation[]>;
  findByUser(userId: number): Promise<Reservation[]>;
  updateStatus(id: number, status: ReservationStatus): Promise<Reservation>;
}
