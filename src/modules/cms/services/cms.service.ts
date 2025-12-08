import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/core/dtos/requests';
import { CreateCmsPageDto } from '../dto/requests/create-cms-page.dto';
import { UpdateCmsPageDto } from '../dto/requests/update-cms-page.dto';
import { CmsMapper } from '../mappers/cms.mapper';
import { CmsPageResponseDto } from '../dto/responses/cms-page.response.dto';
import { CmsRepository } from '../repositories';
import { Cms } from '../entities';
import { DuplicateSlugException } from '../exceptions/duplicate-slug.exception';
import { DuplicateTitleException } from '../exceptions/duplicate-title.exception';
import { UpdateStatusCmsPageDto } from '../dto/requests';

@Injectable()
export class CmsService {
  constructor(
    @InjectRepository(Cms)
    private readonly cmsPageRepository: CmsRepository,
    private readonly cmsMapper: CmsMapper,
  ) {}

  async create(createDto: CreateCmsPageDto): Promise<CmsPageResponseDto> {
    const existingPageWithSlug = await this.cmsPageRepository.findOne({
      where: { slug: createDto.slug },
    });

    if (existingPageWithSlug) {
      throw new DuplicateSlugException(createDto.slug);
    }

    const existingPageWithTitle = await this.cmsPageRepository.findOne({
      where: { title: createDto.title },
    });

    if (existingPageWithTitle) {
      throw new DuplicateTitleException(createDto.title);
    }

    const deletedPage = await this.cmsPageRepository
      .createQueryBuilder('cms')
      .where('cms.slug = :slug', { slug: createDto.slug })
      .andWhere('cms.deletedAt IS NOT NULL')
      .withDeleted()
      .getOne();

    if (deletedPage) {
      await this.cmsPageRepository.restore(deletedPage.id);

      Object.assign(deletedPage, createDto);
      const savedPage = await this.cmsPageRepository.save(deletedPage);
      return this.cmsMapper.toCmsPageDto(savedPage);
    }

    const newPage = this.cmsPageRepository.create(createDto);
    const savedPage = await this.cmsPageRepository.save(newPage);
    return this.cmsMapper.toCmsPageDto(savedPage);
  }

  async findAll(): Promise<CmsPageResponseDto[]> {
    const pages = await this.cmsPageRepository.find({
      where: { isActive: true },
    });
    return pages.map((page) => this.cmsMapper.toCmsPageDto(page));
  }

  async findAllPaginated(
    query: PaginationQueryDto,
  ): Promise<[CmsPageResponseDto[], number]> {
    // const { page, limit, search, sortBy, sortOrder } = query;
    const { page, limit, search } = query;

    const skip = (page - 1) * limit;

    const queryBuilder = this.cmsPageRepository.createQueryBuilder('cms');

    if (search) {
      queryBuilder.where('cms.title ILIKE :search OR cms.slug ILIKE :search', {
        search: `%${search}%`,
      });
    }

    // if (sortBy) {
    //   const validSortFields = ['title', 'createdAt'];
    //   const field = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    //   queryBuilder.orderBy(`cms.${field}`, sortOrder);
    // } else {
    //   queryBuilder.orderBy('cms.createdAt', sortOrder);
    // }

    queryBuilder.skip(skip).take(limit);

    const [pages, total] = await queryBuilder.getManyAndCount();

    return [pages.map((cms) => this.cmsMapper.toCmsPageDto(cms)), total];
  }

  async findOneBySlug(slug: string): Promise<CmsPageResponseDto> {
    const page = await this.cmsPageRepository.findOne({ where: { slug } });
    if (!page) {
      throw new NotFoundException(`Page with slug ${slug} not found`);
    }
    return this.cmsMapper.toCmsPageDto(page);
  }

  async findOneById(id: string): Promise<CmsPageResponseDto> {
    const page = await this.cmsPageRepository.findOne({ where: { id } });
    if (!page) {
      throw new NotFoundException(`Page with id ${id} not found`);
    }
    return this.cmsMapper.toCmsPageDto(page);
  }

  async update(
    id: string,
    updateDto: UpdateCmsPageDto,
  ): Promise<CmsPageResponseDto> {
    const page = await this.cmsPageRepository.findOne({ where: { id } });
    if (!page) {
      throw new NotFoundException(`Page with id ${id} not found`);
    }

    if (updateDto.slug && updateDto.slug !== page.slug) {
      const existingPageWithSlug = await this.cmsPageRepository.findOne({
        where: { slug: updateDto.slug },
      });
      if (existingPageWithSlug && existingPageWithSlug.id !== id) {
        throw new DuplicateSlugException(updateDto.slug);
      }
    }

    if (updateDto.title && updateDto.title !== page.title) {
      const existingPageWithTitle = await this.cmsPageRepository.findOne({
        where: { title: updateDto.title },
      });
      if (existingPageWithTitle && existingPageWithTitle.id !== id) {
        throw new DuplicateTitleException(updateDto.title);
      }
    }

    Object.assign(page, updateDto);
    const savedPage = await this.cmsPageRepository.save(page);
    return this.cmsMapper.toCmsPageDto(savedPage);
  }

  async updateStatus(
    id: string,
    updateDto: UpdateStatusCmsPageDto,
  ): Promise<CmsPageResponseDto> {
    const page = await this.cmsPageRepository.findOne({ where: { id } });
    if (!page) {
      throw new NotFoundException(`Page with id ${id} not found`);
    }

    page.isActive = updateDto.isActive;
    const savedPage = await this.cmsPageRepository.save(page);
    return this.cmsMapper.toCmsPageDto(savedPage);
  }

  async remove(id: string): Promise<void> {
    const page = await this.cmsPageRepository.findOne({ where: { id } });
    if (!page) {
      throw new NotFoundException(`Page with id ${id} not found`);
    }

    await this.cmsPageRepository.softDelete(id);
  }
}
