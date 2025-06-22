import { Hotel } from 'generated/prisma';
import { CreateHotelDto } from '../dto/createHotel.dto';
import { UpdateHotelDto } from '../dto/updateHotel.dto';

export interface IHotelRepository {
  createHotel(data: CreateHotelDto): Promise<Hotel>;
  findHotelById(id: number): Promise<Hotel | null>;
  findHotelByName(name: string): Promise<Hotel | null>;
  findHotels(): Promise<Hotel[]>;
  findHotelsByOwner(ownerId: number): Promise<Hotel[]>;
  updateHotel(id: number, data: UpdateHotelDto): Promise<Hotel | null>;
  deleteHotel(id: number): Promise<Hotel | null>;
}
