import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortOrder } from 'src/core/enums/sort.enum';
import { ClientException } from 'src/core/exceptions/client.exception';
import { QueryFailedError } from 'typeorm';
import { Faq } from '../entities';
import { CreateFaqDto, QueryFaqDto, UpdateFaqDto } from '../dto/requests';
import { FaqRepository } from '../repositories';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepository: FaqRepository,
  ) {}

  async create(createDto: CreateFaqDto): Promise<Faq> {
    try {
      const faq = this.faqRepository.create(createDto);
      return this.faqRepository.save(faq);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes('duplicate key value')
      ) {
        throw new ClientException('Question already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<Faq[]> {
    return this.faqRepository.find({
      where: { isActive: true },
      order: { order: 'ASC' },
    });
  }

  async findAllPaginated(query: QueryFaqDto): Promise<[Faq[], number]> {
    const {
      page = 1,
      limit = 10,
      search,
      // sortBy = 'order',
      // sortOrder = SortOrder.ASC,
      isActive,
    } = query;

    const queryBuilder = this.faqRepository.createQueryBuilder('faq');

    if (isActive !== undefined) {
      queryBuilder.andWhere('faq.isActive = :isActive', { isActive });
    }

    if (search) {
      queryBuilder.andWhere(
        '(faq.question ILIKE :search OR faq.answer ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply sorting
    // if (sortBy && sortOrder) {
    //   queryBuilder.orderBy(`faq.${sortBy}`, sortOrder);
    // } else {
    //   queryBuilder.orderBy('faq.order', SortOrder.ASC);
    // }

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    return queryBuilder.getManyAndCount();
  }

  async findOne(id: string): Promise<Faq> {
    const faq = await this.faqRepository.findOne({ where: { id } });
    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
    return faq;
  }

  async update(id: string, updateDto: UpdateFaqDto): Promise<Faq> {
    try {
      const faq = await this.findOne(id);
      Object.assign(faq, updateDto);
      return this.faqRepository.save(faq);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes('duplicate key value')
      ) {
        throw new ClientException('Question already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.faqRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
  }

  async toggleStatus(id: string): Promise<Faq> {
    const faq = await this.findOne(id);
    faq.isActive = !faq.isActive;
    return this.faqRepository.save(faq);
  }

  async reorder(id: string, newOrder: number): Promise<Faq> {
    const faq = await this.findOne(id);
    const oldOrder = faq.order;

    // Update orders of other FAQs
    if (newOrder > oldOrder) {
      await this.faqRepository
        .createQueryBuilder('faq')
        .update(Faq)
        .set({ order: () => 'order - 1' })
        .where('order > :oldOrder AND order <= :newOrder', {
          oldOrder,
          newOrder,
        })
        .execute();
    } else if (newOrder < oldOrder) {
      await this.faqRepository
        .createQueryBuilder('faq')
        .update(Faq)
        .set({ order: () => 'order + 1' })
        .where('order >= :newOrder AND order < :oldOrder', {
          oldOrder,
          newOrder,
        })
        .execute();
    }

    // Update the target FAQ's order
    faq.order = newOrder;
    return this.faqRepository.save(faq);
  }
}
