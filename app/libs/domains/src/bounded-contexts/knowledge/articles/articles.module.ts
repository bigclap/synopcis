import { Module } from '@nestjs/common';
import { ArticlesDomainService } from './domain/articles.service';

@Module({
  providers: [ArticlesDomainService],
  exports: [ArticlesDomainService],
})
export class ArticlesDomainModule {}
