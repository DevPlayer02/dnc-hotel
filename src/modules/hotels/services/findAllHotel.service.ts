import { Inject, Injectable } from '@nestjs/common';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';
import { IHotelRepository } from '../domain/repositories/IHotel.repositories';

@Injectable()
export class FindAllHotelsService {
  constructor(
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepository: IHotelRepository,
  ) {}
  async execute() {
    return await this.hotelRepository.findHotels();
  }
}
