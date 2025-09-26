import { Module } from '@nestjs/common';
import { RenderModule } from '@synop/rendering';
import { FrontendController } from './frontend.controller';
import { FrontendService } from './frontend.service';

@Module({
  imports: [RenderModule],
  controllers: [FrontendController],
  providers: [FrontendService],
})
export class FrontendModule {}
