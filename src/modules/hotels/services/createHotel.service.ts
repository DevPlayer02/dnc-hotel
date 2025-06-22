import { Inject, Injectable } from '@nestjs/common';
import { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import { CreateHotelDto } from '../domain/dto/createHotel.dto';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';

@Injectable()
export class CreateHotelsService {
  constructor(
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepository: IHotelRepository,
  ) {}

  async execute(createHotelDto: CreateHotelDto) {
    return await this.hotelRepository.createHotel(createHotelDto);
  }
}
