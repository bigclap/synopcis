import { Inject, Injectable } from '@nestjs/common';
import {
  MODERATION_POLICY_REGISTRY,
  ArticleFreezeContext,
  BlockSourceContext,
  ModerationPolicyRegistry,
  UserRestrictionContext,
} from './policies.domain.entity';

@Injectable()
export class ModerationPoliciesDomainService {
  constructor(
    @Inject(MODERATION_POLICY_REGISTRY)
    private readonly registry: ModerationPolicyRegistry,
  ) {}

  async evaluateArticleFreeze(context: ArticleFreezeContext): Promise<void> {
    // TODO: evaluate article freeze policy
    throw new Error('ModerationPoliciesDomainService.evaluateArticleFreeze not implemented');
  }

  async evaluateBlockSource(context: BlockSourceContext): Promise<void> {
    // TODO: evaluate block source policy
    throw new Error('ModerationPoliciesDomainService.evaluateBlockSource not implemented');
  }

  async evaluateUserRestriction(
    context: UserRestrictionContext,
  ): Promise<void> {
    // TODO: evaluate user restriction policy
    throw new Error('ModerationPoliciesDomainService.evaluateUserRestriction not implemented');
  }
}
