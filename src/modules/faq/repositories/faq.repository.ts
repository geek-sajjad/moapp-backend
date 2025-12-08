import { DataSource } from 'typeorm';
import { BaseRepository } from '../../../core/repositories/base.repository';
import { Faq } from '../entities/faq.entity';

export class FaqRepository extends BaseRepository<Faq> {
  constructor(dataSource: DataSource) {
    super(dataSource, Faq);
  }
}
