import { Test, TestingModule } from '@nestjs/testing';
import { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import { FindAllHotelsService } from './findAllHotel.service';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';
import { Hotel } from 'generated/prisma';
import { REDIS_HOTEL_KEY } from '../utils/redisKey';

let service: FindAllHotelsService;
let hotelRepository: IHotelRepository;
let redis: { get: jest.Mock; set: jest.Mock };

const hotelMock: Hotel = {
  id: 1,
  name: 'Test Hotel',
  description: 'A test hotel description',
  image: 'test-image.jpg',
  price: 100,
  address: '123 test St',
  ownerId: 1,
  createdAt: new Date('2025-08-14T10:41:00.753Z'),
  updatedAt: new Date('2025-08-14T10:41:00.753Z'),
};

describe('FindAllHotelsService', () => {
  beforeEach(() => {
    process.env.APP_API_URL = 'http://localhost:3000';
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllHotelsService,
        {
          provide: HOTEL_REPOSITORY_TOKEN,
          useValue: {
            findHotels: jest.fn().mockResolvedValue([hotelMock]),
            countHotels: jest.fn().mockResolvedValue(1),
          },
        },
        {
          provide: 'default_IORedisModuleConnectionToken',
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FindAllHotelsService>(FindAllHotelsService);
    hotelRepository = module.get<IHotelRepository>(HOTEL_REPOSITORY_TOKEN);
    redis = module.get('default_IORedisModuleConnectionToken');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return hotels from Redis if available', async () => {
    const hotelsFromRedis = [hotelMock];
    redis.get.mockResolvedValue(JSON.stringify(hotelsFromRedis));

    const result = await service.execute();

    (result.data as Hotel[]).forEach((hotel) => {
      hotel.createdAt = new Date(hotel.createdAt);
      hotel.updatedAt = new Date(hotel.updatedAt);
    });

    expect(redis.get).toHaveBeenCalledWith(REDIS_HOTEL_KEY);
    expect(result.data).toEqual(hotelsFromRedis);
  });

  it('should fetch hotels from repository if not in Redis and cache them', async () => {
    redis.get.mockResolvedValue(null);

    const result = await service.execute();

    expect(redis.get).toHaveBeenCalledWith(REDIS_HOTEL_KEY);
    expect(hotelRepository.findHotels).toHaveBeenCalledWith(0, 10);
    expect(hotelRepository.countHotels).toHaveBeenCalled();
    expect(redis.set).toHaveBeenCalledWith(
      REDIS_HOTEL_KEY,
      JSON.stringify([hotelMock]),
    );
    expect(result.data).toEqual([hotelMock]);
    expect(result.total).toEqual(1);
    expect(result).toEqual({
      total: 1,
      page: 1,
      per_page: 10,
      data: [hotelMock],
    });
  });

  it('should return the correct pagination metadata', async () => {
    redis.get.mockResolvedValue(null);

    const page = 2;
    const limit = 5;
    const result = await service.execute(page, limit);

    expect(hotelRepository.findHotels).toHaveBeenCalledWith(5, 5);
    expect(result.page).toEqual(page);
    expect(result.per_page).toEqual(limit);
  });

  it('should format hotel images URLs correctly', async () => {
    const hotelWithImage = { ...hotelMock, image: 'test-image.jpg' };
    redis.get.mockResolvedValue(null);
    (hotelRepository.findHotels as jest.Mock).mockResolvedValue([
      hotelWithImage,
    ]);

    const result = await service.execute();

    const data = result.data as Hotel[];

    expect(data[0].image).toEqual('test-image.jpg');
  });
});
