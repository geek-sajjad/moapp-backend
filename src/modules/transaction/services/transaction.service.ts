import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from '../entities';
import { TransactionRepository } from '../repositories';
import { CreateTransactionDto, UpdateTransactionDto } from '../dto/requests';
import { TransactionSummaryDto } from '../dto/responses';
import { ContactService } from 'src/modules/contact/services';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: TransactionRepository,
    @Inject(forwardRef(() => ContactService))
    private readonly contactService: ContactService,
  ) {}

  async create(
    userId: string,
    createDto: CreateTransactionDto,
  ): Promise<TransactionEntity> {
    // Verify that the contact belongs to the user
    await this.contactService.verifyOwnership(createDto.contactId, userId);

    const transaction = this.transactionRepository.create(createDto);
    return this.transactionRepository.save(transaction);
  }

  async findAllByContact(
    contactId: string,
    userId: string,
  ): Promise<TransactionEntity[]> {
    // Verify that the contact belongs to the user
    await this.contactService.verifyOwnership(contactId, userId);

    return this.transactionRepository.findByContactId(contactId);
  }

  async findOne(
    id: string,
    contactId: string,
    userId: string,
  ): Promise<TransactionEntity> {
    // Verify that the contact belongs to the user
    await this.contactService.verifyOwnership(contactId, userId);

    const transaction = await this.transactionRepository.findByIdAndContactId(
      id,
      contactId,
    );

    if (!transaction) {
      throw new NotFoundException('message.TRANSACTION.NOT_FOUND');
    }

    return transaction;
  }

  async update(
    id: string,
    contactId: string,
    userId: string,
    updateDto: UpdateTransactionDto,
  ): Promise<TransactionEntity> {
    const transaction = await this.findOne(id, contactId, userId);

    Object.assign(transaction, updateDto);
    return this.transactionRepository.save(transaction);
  }

  async delete(
    id: string,
    contactId: string,
    userId: string,
  ): Promise<boolean> {
    // Verify ownership first
    await this.findOne(id, contactId, userId);

    const deleted = await this.transactionRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundException('message.TRANSACTION.NOT_FOUND');
    }
    return deleted;
  }

  async getContactSummary(
    contactId: string,
    userId: string,
  ): Promise<TransactionSummaryDto> {
    // Verify that the contact belongs to the user
    await this.contactService.verifyOwnership(contactId, userId);

    const summary =
      await this.transactionRepository.getContactBalance(contactId);

    return summary;
  }

  async getUserTotalSummary(userId: string): Promise<TransactionSummaryDto> {
    const summary =
      await this.transactionRepository.getUserTotalBalance(userId);

    return summary;
  }
}
