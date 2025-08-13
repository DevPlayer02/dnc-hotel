import { Injectable } from '@nestjs/common';
import { IReservationRepository } from '../domain/repositories/IReservations.repositories';
import { Reservation } from 'generated/prisma';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ReservationRepositories implements IReservationRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any): Promise<Reservation> {
    return this.prisma.reservation.create({ data });
  }
}
