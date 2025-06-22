import { Inject, Injectable } from '@nestjs/common';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';
import { IHotelRepository } from '../domain/repositories/IHotel.repositories';

@Injectable()
export class RemoveHotelService {
  constructor(
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepository: IHotelRepository,
  ) {}
  execute(id: number) {
    return `This action removes a #${id} hotel`;
  }
}
