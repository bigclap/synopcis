I have created a new worker for ingesting Wikipedia articles. Here are the files I have created and modified:

**Created:**
- `app/apps/worker-ingestion/`
- `app/apps/worker-ingestion/src/worker-ingestion.controller.spec.ts`
- `app/apps/worker-ingestion/src/worker-ingestion.controller.ts`
- `app/apps/worker-ingestion/src/worker-ingestion.module.ts`
- `app/apps/worker-ingestion/src/worker-ingestion.service.ts`
- `app/apps/worker-ingestion/src/main.ts`
- `app/apps/worker-ingestion/src/wikipedia.service.ts`
- `app/apps/worker-ingestion/src/llm.service.ts`
- `app/apps/worker-ingestion/src/storage.service.ts`
- `app/apps/gateway/src/dto/create-ingestion-task.dto.ts`
- `app/apps/worker-ingestion/src/storage.service.spec.ts`
- `app/apps/worker-ingestion/src/wikipedia.service.spec.ts`
- `app/apps/worker-ingestion/src/llm.service.spec.ts`

**Modified:**
- `app/libs/shared-kernel/src/events/task.types.ts`
- `app/apps/gateway/src/gateway.controller.ts`
- `app/apps/gateway/src/gateway.service.ts`
- `app/apps/worker-ingestion/src/worker-ingestion.module.ts`
- `app/apps/worker-ingestion/src/worker-ingestion.service.ts`
- `app/apps/worker-ingestion/src/worker-ingestion.controller.spec.ts`
- `app/package.json`
- `app/package-lock.json`
