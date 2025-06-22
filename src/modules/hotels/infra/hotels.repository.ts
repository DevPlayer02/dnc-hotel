import { Hotel } from 'generated/prisma';
import { CreateHotelDto } from '../domain/dto/createHotel.dto';
import { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HotelsRepositories implements IHotelRepository {
  constructor(private readonly prisma: PrismaService) {}

  createHotel(data: CreateHotelDto): Promise<Hotel> {
    return this.prisma.hotel.create({ data });
  }

  findHotelById(id: number): Promise<Hotel | null> {
    return this.prisma.hotel.findUnique({ where: { id } });
  }
  findHotelByName(name: string): Promise<Hotel | null> {
    return this.prisma.hotel.findFirst({ where: { name } });
  }
  findHotels(): Promise<Hotel[]> {
    return this.prisma.hotel.findMany();
  }
  updateHotel(id: number, data: CreateHotelDto): Promise<Hotel | null> {
    return this.prisma.hotel.update({ where: { id }, data });
  }
  deleteHotel(id: number): Promise<Hotel | null> {
    return this.prisma.hotel.delete({ where: { id } });
  }
}
