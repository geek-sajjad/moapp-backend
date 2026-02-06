import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionEntity } from '../entities';
import { TransactionRepository } from '../repositories';
import { CreateTransactionDto } from '../dto/requests';
import { TransactionResponseDto, TransactionSummaryDto } from '../dto/responses';
import { CustomerService } from 'src/modules/customer/services';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly customerService: CustomerService,
    @InjectMapper()
    private readonly mapper: Mapper,
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
    });
    return this.transactionRepository.save(transaction);
  }

  async findAllByCustomer(
    customerId: string,
    userId: string,
  ): Promise<TransactionResponseDto[]> {
    // Verify that the customer belongs to the user
    await this.customerService.findOne(customerId, userId);

    const data = await this.transactionRepository.findByCustomerId(customerId);
    return this.mapper.mapArray(
      data,
      TransactionEntity,
      TransactionResponseDto,
    );
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
