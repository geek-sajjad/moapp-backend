import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/core/repositories/base.repository';
import { TransactionEntity } from '../entities';
import { TransactionTypeEnum } from '../enums/transaction-type.enum';

export class TransactionRepository extends BaseRepository<TransactionEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, TransactionEntity);
  }

  async findByCustomerId(customerId: string): Promise<TransactionEntity[]> {
    return this.find({
      where: { customerId },
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async findByIdAndCustomerId(
    id: string,
    customerId: string,
  ): Promise<TransactionEntity | null> {
    return this.findOne({
      where: { id, customerId },
    });
  }

  async getCustomerBalance(customerId: string): Promise<{
    totalBalance: number;
    totalTransactions: number;
    totalType: TransactionTypeEnum;
  }> {
    // const result = await this.createQueryBuilder('transaction')
    //   .select('SUM(transaction.creditAmount)', 'totalCredit')
    //   .addSelect('SUM(transaction.debitAmount)', 'totalDebit')
    //   .addSelect('COUNT(*)', 'totalTransactions')
    //   .where('transaction.customerId = :customerId', { customerId })
    //   .getRawOne();

    // const totalCredit = parseFloat(result?.totalCredit || '0');
    // const totalDebit = parseFloat(result?.totalDebit || '0');
    // const balance = totalCredit - totalDebit;
    // const totalTransactions = parseInt(result?.totalTransactions || '0', 10);

    const res = await this.createQueryBuilder('transaction')
      .select(
        `
        SUM(
          CASE WHEN transaction.type = 'CREDIT' THEN transaction.amount ELSE -transaction.amount END
        )
        `,
        'totalBalance',
      )
      .addSelect('COUNT(*)', 'totalTransactions')
      .where('transaction.customerId = :customerId', { customerId })
      .getRawOne();

    const totalBalance = parseFloat(res?.totalBalance || '0');
    const totalTransactions = parseInt(res?.totalTransactions || '0', 10);

    return {
      totalBalance: Math.abs(totalBalance),
      totalTransactions,
      totalType:
        totalBalance > 0
          ? TransactionTypeEnum.CREDIT
          : TransactionTypeEnum.DEBIT,
    };
  }

  async getUserTotalBalance(userId: string): Promise<{
    totalBalance: number;
    totalTransactions: number;
    totalType: TransactionTypeEnum;
  }> {
    const res = await this.createQueryBuilder('transaction')
      .select(
        `
        SUM(
          CASE WHEN transaction.type = 'CREDIT' THEN transaction.amount ELSE -transaction.amount END
        )
        `,
        'totalBalance',
      )
      .addSelect('COUNT(*)', 'totalTransactions')
      .where('transaction.userId = :userId', { userId })
      .getRawOne();

    const totalBalance = parseFloat(res?.totalBalance || '0');
    const totalTransactions = parseInt(res?.totalTransactions || '0', 10);

    return {
      totalBalance: Math.abs(totalBalance),
      totalTransactions,
      totalType:
        totalBalance > 0
          ? TransactionTypeEnum.CREDIT
          : TransactionTypeEnum.DEBIT,
    };
  }
}
