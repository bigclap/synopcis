import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FrontendModule } from './frontend.module';

async function bootstrap() {
  const app = await NestFactory.create(FrontendModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3003);
}
bootstrap();
