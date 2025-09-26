import { NestFactory } from '@nestjs/core';
import { WorkerFrontendModule } from './worker-frontend.module';

async function bootstrap() {
  const app = await NestFactory.create(WorkerFrontendModule);
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3003);
}

bootstrap();
