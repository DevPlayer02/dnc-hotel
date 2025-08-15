import { Test, TestingModule } from '@nestjs/testing';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';
import { CreateHotelsService } from './createHotel.service';
import { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import { REDIS_HOTEL_KEY } from '../utils/redisKey';

let service: CreateHotelsService;
let hotelRepository: IHotelRepository;
let redis: { del: jest.Mock };

const createHotelMock = {
  id: 1,
  name: 'Test Hotel',
  description: 'A test hotel description',
  image: 'test-image.jpg',
  price: 100,
  address: '123 test St',
  ownerId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const userIdMock = 1;

describe('CreateHotelsService', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateHotelsService,
        {
          provide: HOTEL_REPOSITORY_TOKEN,
          useValue: {
            createHotel: jest.fn().mockResolvedValue(createHotelMock),
          },
        },
        {
          provide: 'default_IORedisModuleConnectionToken',
          useValue: {
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreateHotelsService>(CreateHotelsService);
    hotelRepository = module.get<IHotelRepository>(HOTEL_REPOSITORY_TOKEN);
    redis = module.get('default_IORedisModuleConnectionToken');
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delete the redis key', async () => {
    const redisDelSpy = jest.spyOn(redis, 'del').mockResolvedValue(1);

    await service.execute(createHotelMock, userIdMock);

    expect(redisDelSpy).toHaveBeenCalledWith(REDIS_HOTEL_KEY);
  });

  it('should create a hotel', async () => {
    const result = await service.execute(createHotelMock, userIdMock);

    expect(hotelRepository.createHotel).toHaveBeenCalledWith(
      createHotelMock,
      userIdMock,
    );

    expect(result).toEqual(createHotelMock);
  });
});
