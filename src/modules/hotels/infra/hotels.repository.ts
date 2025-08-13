import { Hotel } from 'generated/prisma';
import { CreateHotelDto } from '../domain/dto/createHotel.dto';
import { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateHotelDto } from '../domain/dto/updateHotel.dto';

@Injectable()
export class HotelsRepositories implements IHotelRepository {
  constructor(private readonly prisma: PrismaService) {}

  createHotel(data: CreateHotelDto, id: number): Promise<Hotel> {
    data.ownerId = id;
    return this.prisma.hotel.create({ data });
  }

  findHotelById(id: number): Promise<Hotel | null> {
    return this.prisma.hotel.findUnique({
      where: { id: Number(id) },
      include: { owner: true },
    });
  }

  findHotels(offSet: number, limit: number): Promise<Hotel[]> {
    return this.prisma.hotel.findMany({
      take: limit,
      skip: offSet,
      include: { owner: true },
    });
  }

  countHotels(): Promise<number> {
    return this.prisma.hotel.count();
  }

  findHotelByName(name: string): Promise<Hotel[] | null> {
    return this.prisma.hotel.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
  }

  findHotelsByOwner(id: number): Promise<Hotel[]> {
    return this.prisma.hotel.findMany({ where: { ownerId: id } });
  }

  updateHotel(id: number, data: UpdateHotelDto): Promise<Hotel | null> {
    return this.prisma.hotel.update({ where: { id }, data });
  }

  deleteHotel(id: number): Promise<Hotel | null> {
    return this.prisma.hotel.delete({ where: { id } });
  }
}
