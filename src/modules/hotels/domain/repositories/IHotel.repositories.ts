import { Hotel } from 'generated/prisma';
import { CreateHotelDto } from '../dto/createHotel.dto';

export interface IHotelRepository {
  createHotel(data: CreateHotelDto): Promise<Hotel>;
  findHotelById(id: number): Promise<Hotel | null>;
  findHotelByName(name: string): Promise<Hotel | null>;
  findHotels(): Promise<Hotel[]>;
  updateHotel(id: number, data: CreateHotelDto): Promise<Hotel | null>;
  deleteHotel(id: number): Promise<Hotel | null>;
}
