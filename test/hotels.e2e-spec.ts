import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Role } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { Redis } from 'ioredis';
import { CreateHotelDto } from 'src/modules/hotels/domain/dto/createHotel.dto';
import { UpdateHotelDto } from 'src/modules/hotels/domain/dto/updateHotel.dto';
import { FileUploadPipe } from 'src/shared/pipes/fileValidation.pipe';

jest.mock('ioredis', () => {
  const moduleRedis = jest.fn().mockImplementation(() => ({
    del: jest.fn().mockResolvedValue(1),
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    quit: jest.fn().mockRejectedValue(null),
    disconnect: jest.fn().mockResolvedValue(null),
  }));
  return { __esModule: true, default: moduleRedis, Redis: moduleRedis };
});

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let userToken: string;
  let redisClient: Redis;
  let userId: number;
  let hotelId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overridePipe(FileUploadPipe)
      .useValue({ transform: (file) => file })
      .compile();

    app = moduleFixture.createNestApplication();
    redisClient = new Redis();
    prisma = app.get(PrismaService);
    await app.init();

    prisma = app.get(PrismaService);

    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin',
        role: Role.ADMIN,
      },
    });

    userId = adminUser.id;

    const normalUser = await prisma.user.create({
      data: {
        name: 'User',
        email: 'user@example.com',
        password: 'user',
        role: Role.USER,
      },
    });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET must be set for tests');
    }

    adminToken = jwt.sign({ sub: adminUser.id, role: Role.ADMIN }, jwtSecret, {
      expiresIn: '1h',
      issuer: 'dnc_hotel',
      audience: 'users',
    });

    userToken = jwt.sign({ sub: normalUser.id, role: Role.USER }, jwtSecret, {
      expiresIn: '1h',
      issuer: 'dnc_hotel',
      audience: 'users',
    });
  });

  afterAll(async () => {
    try {
      await prisma.reservation.deleteMany({});
      await prisma.hotel.deleteMany({});
      await prisma.user.deleteMany({});
    } catch (err) {
      console.warn('Cleanup failed:', err);
    }

    await app.close();
  });

  it('hotels (POST)', async () => {
    const createHotelDto: CreateHotelDto = {
      name: 'Test Hotel',
      description: 'A test hotel description',
      price: 100,
      address: '123 test St',
      ownerId: userId,
    };

    const response = await request(app.getHttpServer())
      .post('/hotels')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createHotelDto)
      .expect(201);

    hotelId = response.body.id;

    expect(response.body).toMatchObject({
      name: createHotelDto.name,
      description: createHotelDto.description,
      price: createHotelDto.price,
      address: createHotelDto.address,
      ownerId: userId,
    });
  });

  it('/hotels (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/hotels')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data).toHaveLength(1);
  });

  it('/hotels/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/hotels/${hotelId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: hotelId,
      name: 'Test Hotel',
    });
  });

  it('/hotels/:id (PATCH)', async () => {
    const updateHotelDto: UpdateHotelDto = {
      name: 'Updated Hotel',
    };

    const response = await request(app.getHttpServer())
      .patch(`/hotels/${hotelId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateHotelDto)
      .expect(200);

    expect(response.body).toMatchObject({
      name: updateHotelDto.name,
    });
  });

  it('/hotels/image/:hotelId (PATCH)', async () => {
    await request(app.getHttpServer())
      .patch(`/hotels/image/${hotelId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('image', Buffer.from('mock-file-content'), {
        filename: 'mock-file.jpg',
        contentType: 'image/jpeg',
      })
      .expect(200);
  });

  it('/hotels/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/hotels/${hotelId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });
});
