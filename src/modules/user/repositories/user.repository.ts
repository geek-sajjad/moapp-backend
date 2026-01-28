import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/core/repositories/base.repository';
import { UserEntity } from '../entities';

export class UserRepository extends BaseRepository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, UserEntity);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.findOne({ where: { username } });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<UserEntity | null> {
    return this.findOne({ where: { phoneNumber } });
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await super.delete(id);
    return result.affected > 0;
  }
}
