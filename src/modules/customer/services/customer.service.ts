import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from '../repositories';
import { CreateCustomerDto, UpdateCustomerDto } from '../dto/requests';
import { CustomerEntity } from '../entities';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async create(
    userId: string,
    dto: CreateCustomerDto,
  ): Promise<CustomerEntity> {
    const customer = this.customerRepository.create({
      ...dto,
      userId,
      isArchived: false,
    });
    return await this.customerRepository.save(customer);
  }

  async findAll(
    userId: string,
    includeArchived = false,
  ): Promise<CustomerEntity[]> {
    const where: any = { userId };
    if (!includeArchived) {
      where.isArchived = false;
    }

    return await this.customerRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<CustomerEntity> {
    const customer = await this.customerRepository.findOne({
      where: { id, userId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateCustomerDto,
  ): Promise<CustomerEntity> {
    const customer = await this.findOne(id, userId);

    if (dto.name !== undefined) {
      customer.name = dto.name;
    }
    if (dto.phoneNumber !== undefined) {
      customer.phoneNumber = dto.phoneNumber;
    }

    return await this.customerRepository.save(customer);
  }

  async archive(id: string, userId: string): Promise<CustomerEntity> {
    const customer = await this.findOne(id, userId);
    customer.isArchived = true;
    return await this.customerRepository.save(customer);
  }

  async unarchive(id: string, userId: string): Promise<CustomerEntity> {
    const customer = await this.findOne(id, userId);
    customer.isArchived = false;
    return await this.customerRepository.save(customer);
  }
}
