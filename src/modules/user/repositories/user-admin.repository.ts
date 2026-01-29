import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/core/repositories/base.repository';
import { UserAdminEntity } from '../entities';

export class UserAdminRepository extends BaseRepository<UserAdminEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, UserAdminEntity);
  }

  async findByUsername(username: string): Promise<UserAdminEntity | null> {
    return this.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<UserAdminEntity | null> {
    return this.findOne({ where: { email } });
  }

  async findActiveAdmins(): Promise<UserAdminEntity[]> {
    return this.find({ where: { isActive: true } });
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await super.delete(id);
    return result.affected > 0;
  }
}
