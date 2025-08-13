import { Inject, Injectable } from '@nestjs/common';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';
import { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { REDIS_HOTEL_KEY } from '../utils/redisKey';

@Injectable()
export class RemoveHotelService {
  constructor(
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepository: IHotelRepository,
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async execute(id: number) {
    await this.redis.del(REDIS_HOTEL_KEY);

    return await this.hotelRepository.deleteHotel(id);
  }
}
