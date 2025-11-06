import {
  Injectable,
  NotImplementedException,
  OnModuleDestroy,
} from '@nestjs/common';
import { DatabaseConfigService } from '@synop/shared-kernel';
import { Pool, PoolConfig } from 'pg';
import { CreatePhenomenonDto } from './dto/create-phenomenon.dto';
import { TaskQueueService, TaskMessage, TaskType } from '@synop/shared-kernel';
import { PhenomenonDomainService, PhenomenonEntity } from '@synop/domains';

@Injectable()
export class PhenomenonService implements OnModuleDestroy {
  private readonly pool: Pool;

  constructor(
    private readonly config: DatabaseConfigService,
    private readonly taskQueueService: TaskQueueService,
    private readonly phenomenonDomainService: PhenomenonDomainService,
  ) {
    this.pool = new Pool(this.buildConfigFromEnv());
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }

  async createPhenomenon(
    createPhenomenonDto: CreatePhenomenonDto,
  ): Promise<PhenomenonEntity> {
    // TODO: Replace with actual user ID from auth context
    const userId = 'e2e-test-user-id';
    if (userId === 'e2e-test-user-id') {
      // This is a temporary measure to highlight the placeholder
      console.warn('Using hardcoded user ID for phenomenon creation');
    } else {
      throw new NotImplementedException('User authentication not implemented');
    }

    const phenomenon = await this.phenomenonDomainService.createPhenomenon({
      title: createPhenomenonDto.title,
      userId,
    });

    const createTask = new TaskMessage(TaskType.CREATE_PHENomenon, {
      phenomenonId: phenomenon.id,
    });
    await this.taskQueueService.enqueue(createTask);

    if (createPhenomenonDto.generateAiDraft) {
      const draftTask = new TaskMessage(TaskType.GENERATE_AI_DRAFT, {
        phenomenonId: phenomenon.id,
      });
      await this.taskQueueService.enqueue(draftTask);
    }

    return phenomenon;
  }

  async getPhenomenonCard(articleId: string) {
    // TODO: Implement logic to fetch phenomenon card data from the database
    const result = await this.pool.query(
      `
      SELECT c.key, cl.label, c.type
      FROM concepts c
      JOIN concept_labels cl ON c.id = cl.concept_id
      JOIN article_concepts ac ON c.id = ac.concept_id
      WHERE ac.article_id = $1 AND cl.lang_code = 'en'
      `,
      [articleId],
    );

    return {
      articleId,
      properties: result.rows,
    };
  }

  private buildConfigFromEnv(): PoolConfig {
    const base = this.config.getConfigFromEnv('DB');
    return {
      host: base.host,
      port: base.port,
      user: base.user,
      password: base.password,
      database: base.database,
      max: 5,
    };
  }
}
