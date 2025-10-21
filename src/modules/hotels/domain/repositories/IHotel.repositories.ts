import { Hotel } from '@prisma/client';
import { CreateHotelDto } from '../dto/createHotel.dto';
import { UpdateHotelDto } from '../dto/updateHotel.dto';

export interface IHotelRepository {
  createHotel(data: CreateHotelDto, id: number): Promise<Hotel>;
  findHotelById(id: number): Promise<Hotel | null>;
  findHotelByName(name: string): Promise<Hotel[] | null>;
  findHotels(offSet: number, limit: number): Promise<Hotel[]>;
  findHotelsByOwner(id: number): Promise<Hotel[]>;
  updateHotel(id: number, data: UpdateHotelDto): Promise<Hotel | null>;
  deleteHotel(id: number): Promise<Hotel | null>;
  countHotels(): Promise<number>;
}
