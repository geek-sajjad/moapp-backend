import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/core/repositories/base.repository';
import { ContactEntity } from '../entities';

export class ContactRepository extends BaseRepository<ContactEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, ContactEntity);
  }

  async findByUserId(userId: string): Promise<ContactEntity[]> {
    return this.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<ContactEntity | null> {
    return this.findOne({
      where: { id, userId },
      relations: ['transactions'],
    });
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await super.delete(id);
    return result.affected > 0;
  }

  async findContactsWithBalance(userId: string): Promise<ContactEntity[]> {
    return this.createQueryBuilder('contact')
      .leftJoinAndSelect('contact.transactions', 'transaction')
      .where('contact.userId = :userId', { userId })
      .orderBy('contact.createdAt', 'DESC')
      .getMany();
  }
}
