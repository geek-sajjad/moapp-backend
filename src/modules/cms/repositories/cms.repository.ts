import { DataSource } from 'typeorm';
import { BaseRepository } from '../../../core/repositories/base.repository';
import { Cms } from '../entities';

export class CmsRepository extends BaseRepository<Cms> {
  constructor(dataSource: DataSource) {
    super(dataSource, Cms);
  }
}
