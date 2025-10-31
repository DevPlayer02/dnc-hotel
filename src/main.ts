import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: 'GET,PATCH,POST,DELETE',
  });

  const uploadsHotelPath = join(process.cwd(), 'uploads-hotel');
  const uploadsPath = join(process.cwd(), 'uploads');

  app.useStaticAssets(uploadsHotelPath, {
    prefix: '/uploads-hotel',
  });

  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads',
  });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(
    `Nest listening on 0.0.0.0:${port} (ENV PORT=${process.env.PORT})`,
  );

  process.on('uncaughtException', (err) =>
    console.error('uncaughtException', err),
  );
  process.on('unhandledRejection', (err) =>
    console.error('unhandledRejection', err),
  );
}

bootstrap();
