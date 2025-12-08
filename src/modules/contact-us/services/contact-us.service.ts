import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/core/dtos/requests';
import { ContactUs, ContactUsStatus } from '../entities';
import {
  CreateContactUsDto,
  UpdateContactUsDto,
  RespondContactDto,
  UpdateContactStatusDto,
} from '../dto/requests';
import { ContactUsResponseDto } from '../dto/responses';
import { ContactUsMapper } from '../mappers';
import { ContactUsRepository } from '../repositories';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectRepository(ContactUs)
    private readonly contactUsRepository: ContactUsRepository,
    private readonly contactUsMapper: ContactUsMapper,
  ) {}

  async create(createDto: CreateContactUsDto): Promise<ContactUsResponseDto> {
    const contact = this.contactUsRepository.create(createDto);
    const savedContact = await this.contactUsRepository.save(contact);
    return this.contactUsMapper.toContactUsDto(savedContact);
  }

  async findAll(
    queryDto: PaginationQueryDto,
  ): Promise<[ContactUsResponseDto[], number]> {
    const { page, limit, search } = queryDto;
    const queryBuilder =
      this.contactUsRepository.createQueryBuilder('contact_us');

    if (search) {
      queryBuilder.andWhere(
        `(
            contact_us.name ILIKE :search OR
            contact_us.email ILIKE :search OR 
            contact_us.subject ILIKE :search
          )`,
        { search: `%${search}%` },
      );
    }

    queryBuilder.skip((page - 1) * limit).take(limit);
    const [contacts, total] = await queryBuilder.getManyAndCount();

    return [
      contacts.map((contact) => this.contactUsMapper.toContactUsDto(contact)),
      total,
    ];
  }

  async findOne(id: string): Promise<ContactUsResponseDto> {
    const contact = await this.contactUsRepository.findOne({
      where: { id },
    });
    if (!contact) {
      throw new NotFoundException(`Contact message with ID ${id} not found`);
    }
    return this.contactUsMapper.toContactUsDto(contact);
  }

  async update(
    id: string,
    updateDto: UpdateContactUsDto,
  ): Promise<ContactUsResponseDto> {
    const contact = await this.contactUsRepository.findOne({
      where: { id },
    });
    if (!contact) {
      throw new NotFoundException(`Contact message with ID ${id} not found`);
    }
    Object.assign(contact, updateDto);
    const updatedContact = await this.contactUsRepository.save(contact);
    return this.contactUsMapper.toContactUsDto(updatedContact);
  }

  async remove(id: string): Promise<void> {
    const contact = await this.contactUsRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact message with ID ${id} not found`);
    }
    await this.contactUsRepository.softDelete(id);
  }

  async respond(
    id: string,
    respondDto: RespondContactDto,
  ): Promise<ContactUsResponseDto> {
    const contact = await this.contactUsRepository.findOne({
      where: { id },
    });
    if (!contact) {
      throw new NotFoundException(`Contact message with ID ${id} not found`);
    }

    contact.response = respondDto.message;
    contact.status = ContactUsStatus.RESPONDED;
    contact.isResponded = true;

    const updatedContact = await this.contactUsRepository.save(contact);
    return this.contactUsMapper.toContactUsDto(updatedContact);
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateContactStatusDto,
  ): Promise<ContactUsResponseDto> {
    const contact = await this.contactUsRepository.findOne({
      where: { id },
    });
    if (!contact) {
      throw new NotFoundException(`Contact message with ID ${id} not found`);
    }

    contact.status = updateStatusDto.status;

    // Update isResponded flag based on status
    if (
      updateStatusDto.status === ContactUsStatus.RESPONDED ||
      updateStatusDto.status === ContactUsStatus.RESOLVED
    ) {
      contact.isResponded = true;
    }

    const updatedContact = await this.contactUsRepository.save(contact);
    return this.contactUsMapper.toContactUsDto(updatedContact);
  }

  async getAvailableStatuses(): Promise<ContactUsStatus[]> {
    return Object.values(ContactUsStatus);
  }
}
