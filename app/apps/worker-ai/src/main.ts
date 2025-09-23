import { NestFactory } from '@nestjs/core';
import { WorkerAiModule } from './worker-ai.module';

async function bootstrap() {
  const app = await NestFactory.create(WorkerAiModule);
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3001);
}
bootstrap();
