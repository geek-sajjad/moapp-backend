import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/core/repositories/base.repository';
import { TransactionEntity } from '../entities';
import { TransactionTypeEnum } from '../enums';

export class TransactionRepository extends BaseRepository<TransactionEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, TransactionEntity);
  }

  async findByContactId(contactId: string): Promise<TransactionEntity[]> {
    return this.find({
      where: { contactId },
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async findByIdAndContactId(
    id: string,
    contactId: string,
  ): Promise<TransactionEntity | null> {
    return this.findOne({
      where: { id, contactId },
    });
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await super.delete(id);
    return result.affected > 0;
  }

  async getContactBalance(contactId: string): Promise<{
    totalCredit: number;
    totalDebit: number;
    balance: number;
    totalTransactions: number;
  }> {
    const result = await this.createQueryBuilder('transaction')
      .select(
        'SUM(CASE WHEN transaction.type = :credit THEN transaction.amount ELSE 0 END)',
        'totalCredit',
      )
      .addSelect(
        'SUM(CASE WHEN transaction.type = :debit THEN transaction.amount ELSE 0 END)',
        'totalDebit',
      )
      .addSelect('COUNT(*)', 'totalTransactions')
      .where('transaction.contactId = :contactId', { contactId })
      .setParameter('credit', TransactionTypeEnum.CREDIT)
      .setParameter('debit', TransactionTypeEnum.DEBIT)
      .getRawOne();

    const totalCredit = parseFloat(result?.totalCredit || '0');
    const totalDebit = parseFloat(result?.totalDebit || '0');
    const balance = totalCredit - totalDebit;
    const totalTransactions = parseInt(result?.totalTransactions || '0', 10);

    return {
      totalCredit,
      totalDebit,
      balance,
      totalTransactions,
    };
  }

  async getUserTotalBalance(userId: string): Promise<{
    totalCredit: number;
    totalDebit: number;
    balance: number;
    totalTransactions: number;
  }> {
    const result = await this.createQueryBuilder('transaction')
      .innerJoin('transaction.contact', 'contact')
      .select(
        'SUM(CASE WHEN transaction.type = :credit THEN transaction.amount ELSE 0 END)',
        'totalCredit',
      )
      .addSelect(
        'SUM(CASE WHEN transaction.type = :debit THEN transaction.amount ELSE 0 END)',
        'totalDebit',
      )
      .addSelect('COUNT(*)', 'totalTransactions')
      .where('contact.userId = :userId', { userId })
      .setParameter('credit', TransactionTypeEnum.CREDIT)
      .setParameter('debit', TransactionTypeEnum.DEBIT)
      .getRawOne();

    const totalCredit = parseFloat(result?.totalCredit || '0');
    const totalDebit = parseFloat(result?.totalDebit || '0');
    const balance = totalCredit - totalDebit;
    const totalTransactions = parseInt(result?.totalTransactions || '0', 10);

    return {
      totalCredit,
      totalDebit,
      balance,
      totalTransactions,
    };
  }
}
