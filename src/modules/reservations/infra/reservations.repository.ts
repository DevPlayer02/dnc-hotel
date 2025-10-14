import { Injectable } from '@nestjs/common';
import { IReservationRepository } from '../domain/repositories/IReservations.repositories';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Reservation, ReservationStatus } from '@prisma/client';

@Injectable()
export class ReservationRepositories implements IReservationRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any): Promise<Reservation> {
    return this.prisma.reservation.create({ data });
  }

  findbyId(id: number): Promise<Reservation | null> {
    return this.prisma.reservation
      .findUnique({
        where: { id },
        include: {
          user: true,
        },
      })
      .then((reservation) => {
        if (reservation?.user.avatar) {
          reservation.user.avatar = `${process.env.APP_API_URL}/uploads/${reservation.user.avatar}`;
        }
        return reservation;
      });
  }

  findAll(): Promise<Reservation[]> {
    return this.prisma.reservation.findMany();
  }

  findByUser(userId: number): Promise<Reservation[]> {
    return this.prisma.reservation.findMany({
      where: { userId },
      orderBy: { id: 'desc' },
      include: {
        hotel: true,
      },
    });
  }

  updateStatus(id: number, status: ReservationStatus): Promise<Reservation> {
    return this.prisma.reservation.update({ where: { id }, data: { status } });
  }
}
