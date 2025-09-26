import { Module } from '@nestjs/common';
import { SharedKernelModule } from '@synop/shared-kernel';
import { HYDRATION_CACHE } from './services/hydration-orchestrator.service';
import { ManifestRenderer } from './services/manifest-renderer.service';
import { HydrationOrchestrator } from './services/hydration-orchestrator.service';
import { InMemoryHydrationCache } from './services/in-memory-hydration-cache.service';

@Module({
  imports: [SharedKernelModule],
  providers: [
    ManifestRenderer,
    HydrationOrchestrator,
    {
      provide: HYDRATION_CACHE,
      useClass: InMemoryHydrationCache,
    },
  ],
  exports: [ManifestRenderer, HydrationOrchestrator, HYDRATION_CACHE],
})
export class RenderModule {}
