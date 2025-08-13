import { Injectable } from '@nestjs/common';
import { IReservationRepository } from '../domain/repositories/IReservations.repositories';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Reservation, ReservationStatus } from 'generated/prisma';

@Injectable()
export class ReservationRepositories implements IReservationRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any): Promise<Reservation> {
    return this.prisma.reservation.create({ data });
  }

  findbyId(id: number): Promise<Reservation | null> {
    return this.prisma.reservation.findUnique({ where: { id } });
  }

  findAll(): Promise<Reservation[]> {
    return this.prisma.reservation.findMany();
  }

  findByUser(userId: number): Promise<Reservation[]> {
    return this.prisma.reservation.findMany({ where: { userId } });
  }

  updateStatus(id: number, status: ReservationStatus): Promise<Reservation> {
    return this.prisma.reservation.update({ where: { id }, data: { status } });
  }
}
