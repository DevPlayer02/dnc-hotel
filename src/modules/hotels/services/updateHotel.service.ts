import { Inject, Injectable } from '@nestjs/common';
import { UpdateHotelDto } from '../domain/dto/updateHotel.dto';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';
import { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { REDIS_HOTEL_KEY } from '../utils/redisKey';

@Injectable()
export class UpdateHotelService {
  constructor(
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepository: IHotelRepository,
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async execute(id: number, updateHotelDto: UpdateHotelDto) {
    await this.redis.del(REDIS_HOTEL_KEY);

    return await this.hotelRepository.updateHotel(Number(id), updateHotelDto);
  }
}
