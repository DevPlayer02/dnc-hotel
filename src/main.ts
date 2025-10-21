import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,PATCH,POST,DELETE',
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.useStaticAssets(join(__dirname, '..', 'uploads-hotel'), {
    prefix: '/uploads-hotel/',
  });
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  //app.useGlobalInterceptors(new LoggingInterceptor());
  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
