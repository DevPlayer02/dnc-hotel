import { Inject, Injectable } from '@nestjs/common';
import { UpdateHotelDto } from '../domain/dto/updateHotel.dto';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';
import { IHotelRepository } from '../domain/repositories/IHotel.repositories';

@Injectable()
export class UpdateHotelService {
  constructor(
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepository: IHotelRepository,
  ) {}
  async execute(id: number, updateHotelDto: UpdateHotelDto) {
    return await this.hotelRepository.updateHotel(Number(id), updateHotelDto);
  }
}
