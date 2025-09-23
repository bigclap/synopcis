import { Module } from '@nestjs/common';
import { DomainsModule } from '@synop/domains';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DomainsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
