import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VersionEntity } from '../entities';

@Injectable()
export class VersioningRepository {
  constructor(
    @InjectRepository(VersionEntity)
    private readonly versionRepository: Repository<VersionEntity>,
  ) {}

  async save(versionData: Partial<VersionEntity>): Promise<VersionEntity> {
    return this.versionRepository.save(versionData);
  }

  async findAll(): Promise<VersionEntity[]> {
    return this.versionRepository.find();
  }

  async getLatest(): Promise<VersionEntity> {
    const result = await this.versionRepository.find({
      order: { releaseDate: 'DESC' },
      take: 1,
    });
    if (result.length === 0) throw new Error('message.VERSION.NOT_FOUND');
    return result[0];
  }
}
