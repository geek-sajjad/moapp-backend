import { DataSource } from 'typeorm';
import { BaseRepository } from '../repositories/base.repository';
import { BaseEntity } from '../entities/base.entity';

export function createRepository<
  E extends BaseEntity,
  T extends BaseRepository<E>,
>(dataSource: DataSource, RepositoryClass: new (ds: DataSource) => T): T {
  return new RepositoryClass(dataSource);
}
