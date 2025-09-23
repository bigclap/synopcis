import { Injectable } from '@nestjs/common';

export interface DatabaseConfig {
  readonly host: string;
  readonly port: number;
  readonly user: string;
  readonly password: string;
  readonly database: string;
}

@Injectable()
export class DatabaseConfigService {
  getConfigFromEnv(prefix = 'DB'): DatabaseConfig {
    const read = (key: string, fallback?: string): string => {
      const value = process.env[key] ?? fallback;
      if (!value) {
        throw new Error(`Missing required environment variable ${key}`);
      }
      return value;
    };

    return {
      host: read(`${prefix}_HOST`, 'localhost'),
      port: Number.parseInt(read(`${prefix}_PORT`, '5432'), 10),
      user: read(`${prefix}_USER`, 'synopsis'),
      password: read(`${prefix}_PASSWORD`, 'synopsis'),
      database: read(`${prefix}_NAME`, 'synopsis'),
    };
  }
}
