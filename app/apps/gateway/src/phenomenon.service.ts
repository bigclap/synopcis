import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { DatabaseConfigService } from '@synop/shared-kernel';
import { Pool, PoolConfig } from 'pg';

@Injectable()
export class PhenomenonService implements OnModuleDestroy {
  private readonly pool: Pool;

  constructor(private readonly config: DatabaseConfigService) {
    this.pool = new Pool(this.buildConfigFromEnv());
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
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
