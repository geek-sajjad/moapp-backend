import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactEntity } from '../entities';
import { ContactRepository } from '../repositories';
import { CreateContactDto, UpdateContactDto } from '../dto/requests';
import { ContactWithBalanceDto } from '../dto/responses';
import { TransactionRepository } from 'src/modules/transaction/repositories';
import { TransactionTypeEnum } from 'src/modules/transaction/enums';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly contactRepository: ContactRepository,
    @Inject(forwardRef(() => TransactionRepository))
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async create(
    userId: string,
    createDto: CreateContactDto,
  ): Promise<ContactEntity> {
    const contact = this.contactRepository.create({
      ...createDto,
      userId,
    });

    return this.contactRepository.save(contact);
  }

  async findAllByUser(userId: string): Promise<ContactEntity[]> {
    return this.contactRepository.findByUserId(userId);
  }

  async findAllWithBalance(userId: string): Promise<ContactWithBalanceDto[]> {
    const contacts =
      await this.contactRepository.findContactsWithBalance(userId);

    return Promise.all(
      contacts.map(async (contact) => {
        const balance = await this.calculateContactBalance(contact);
        return {
          ...contact,
          balance: balance.balance,
          transactionCount: balance.totalTransactions,
        } as ContactWithBalanceDto;
      }),
    );
  }

  async findOne(id: string, userId: string): Promise<ContactEntity> {
    const contact = await this.contactRepository.findByIdAndUserId(id, userId);
    if (!contact) {
      throw new NotFoundException('message.CONTACT.NOT_FOUND');
    }
    return contact;
  }

  async update(
    id: string,
    userId: string,
    updateDto: UpdateContactDto,
  ): Promise<ContactEntity> {
    const contact = await this.findOne(id, userId);

    Object.assign(contact, updateDto);
    return this.contactRepository.save(contact);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const contact = await this.findOne(id, userId);

    const deleted = await this.contactRepository.deleteById(contact.id);
    if (!deleted) {
      throw new NotFoundException('message.CONTACT.NOT_FOUND');
    }
    return deleted;
  }

  async verifyOwnership(contactId: string, userId: string): Promise<void> {
    const contact = await this.contactRepository.findOne({
      where: { id: contactId },
    });

    if (!contact) {
      throw new NotFoundException('message.CONTACT.NOT_FOUND');
    }

    if (contact.userId !== userId) {
      throw new ForbiddenException('message.CONTACT.FORBIDDEN');
    }
  }

  private async calculateContactBalance(contact: ContactEntity): Promise<{
    totalCredit: number;
    totalDebit: number;
    balance: number;
    totalTransactions: number;
  }> {
    if (!contact.transactions || contact.transactions.length === 0) {
      return {
        totalCredit: 0,
        totalDebit: 0,
        balance: 0,
        totalTransactions: 0,
      };
    }

    const totalCredit = contact.transactions
      .filter((t) => t.type === TransactionTypeEnum.CREDIT)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalDebit = contact.transactions
      .filter((t) => t.type === TransactionTypeEnum.DEBIT)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      totalCredit,
      totalDebit,
      balance: totalCredit - totalDebit,
      totalTransactions: contact.transactions.length,
    };
  }
}
