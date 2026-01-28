import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from '../entities';
import { TransactionRepository } from '../repositories';
import { CreateTransactionDto } from '../dto/requests';
import { TransactionSummaryDto } from '../dto/responses';
import { CustomerService } from 'src/modules/customer/services';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: TransactionRepository,
    private readonly customerService: CustomerService,
  ) {}

  async create(
    userId: string,
    createDto: CreateTransactionDto,
  ): Promise<TransactionEntity> {
    // Verify that the customer belongs to the user
    await this.customerService.findOne(createDto.customerId, userId);

    const transaction = this.transactionRepository.create({
      ...createDto,
      userId,
      debitAmount: createDto.debitAmount || 0,
      creditAmount: createDto.creditAmount || 0,
    });
    return this.transactionRepository.save(transaction);
  }

  async findAllByCustomer(
    customerId: string,
    userId: string,
  ): Promise<TransactionEntity[]> {
    // Verify that the customer belongs to the user
    await this.customerService.findOne(customerId, userId);

    return this.transactionRepository.findByCustomerId(customerId);
  }

  async findOne(
    id: string,
    customerId: string,
    userId: string,
  ): Promise<TransactionEntity> {
    // Verify that the customer belongs to the user
    await this.customerService.findOne(customerId, userId);

    const transaction = await this.transactionRepository.findByIdAndCustomerId(
      id,
      customerId,
    );

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async getCustomerSummary(
    customerId: string,
    userId: string,
  ): Promise<TransactionSummaryDto> {
    // Verify that the customer belongs to the user
    await this.customerService.findOne(customerId, userId);

    const summary =
      await this.transactionRepository.getCustomerBalance(customerId);

    return summary;
  }

  async getUserTotalSummary(userId: string): Promise<TransactionSummaryDto> {
    const summary =
      await this.transactionRepository.getUserTotalBalance(userId);

    return summary;
  }
}
