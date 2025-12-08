/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { BaseEntity } from '../entities/base.entity';

export class BaseRepository<T extends BaseEntity> extends Repository<T> {
  constructor(dataSource: DataSource, entity: new () => T) {
    super(entity, dataSource.createEntityManager());
  }

  createQueryBuilder(alias: string): SelectQueryBuilder<T> {
    // return super.createQueryBuilder(alias).where(`${alias}.deletedAt IS NULL`);
    return super.createQueryBuilder(alias);
  }

  find(options?: any): Promise<T[]> {
    return super.find({
      ...options,
      where: { ...options?.where, deletedAt: null },
    });
  }

  findOne(options: any): Promise<T | null> {
    return super.findOne({
      ...options,
      where: { ...options?.where, deletedAt: null },
    });
  }

  findOneBy(where: any): Promise<T | null> {
    return super.findOneBy({ ...where, deletedAt: null });
  }

  findAndCount(options?: any): Promise<[T[], number]> {
    return super.findAndCount({
      ...options,
      where: { ...options?.where, deletedAt: null },
    });
  }

  findAndCountBy(where: any): Promise<[T[], number]> {
    return super.findAndCountBy({ ...where, deletedAt: null });
  }
}
