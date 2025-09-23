import { NestFactory } from '@nestjs/core';
import { WorkerGitModule } from './worker-git.module';

async function bootstrap() {
  const app = await NestFactory.create(WorkerGitModule);
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3002);
}
bootstrap();
