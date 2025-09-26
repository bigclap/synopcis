import { Module } from '@nestjs/common';
import { SharedKernelModule } from '@synop/shared-kernel';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [SharedKernelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
