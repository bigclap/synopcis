import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { PhenomenonEntity } from './phenomenon.entity';

export interface CreatePhenomenonInput {
  title: string;
  userId: string;
}

@Injectable()
export class PhenomenonDomainService {
  constructor(
    @InjectRepository(PhenomenonEntity)
    private readonly phenomenonRepository: Repository<PhenomenonEntity>,
  ) {}

  async createPhenomenon(
    input: CreatePhenomenonInput,
  ): Promise<PhenomenonEntity> {
    const phenomenon = this.phenomenonRepository.create({
      id: uuidv4(),
      slug: input.title.toLowerCase().replace(/\\s+/g, '-'),
      userId: input.userId,
    });
    return this.phenomenonRepository.save(phenomenon);
  }

  async findPhenomenonById(id: string): Promise<PhenomenonEntity | null> {
    return this.phenomenonRepository.findOneBy({ id });
  }
}
