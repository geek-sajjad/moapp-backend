import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Query,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/core/dtos/responses';
import { ResponseUtil } from 'src/core/utilities';
import { Roles } from 'src/auth/decorators';
import { RoleEnum } from 'src/core/enums';
import { AuthGuard, RolesGuard } from 'src/core/guards';
import { PageOptionsDto } from 'src/core/dtos/requests';
import { ParseUUIDCustomPipe } from 'src/core/pipes';
import { ApiPaginatedResponse } from 'src/core/decorators';
import { Faq } from '../entities';
import { CreateFaqDto, QueryFaqDto, UpdateFaqDto } from '../dto/requests';
import { FaqResponseDto } from '../dto/responses';
import { FaqService } from '../services';

@ApiTags('FAQ')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.ADMIN)
@ApiBearerAuth()
@Controller('faqs')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new FAQ' })
  @ApiResponse({
    status: 201,
    description: 'FAQ created successfully',
    type: FaqResponseDto,
  })
  async create(
    @Body() createDto: CreateFaqDto,
  ): Promise<ResponseDto<FaqResponseDto>> {
    const faq = await this.faqService.create(createDto);
    return ResponseUtil.success('FAQ created successfully', faq);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all FAQs with pagination, search, and sorting',
  })
  @ApiPaginatedResponse(FaqResponseDto)
  async findAll(@Query() query: QueryFaqDto) {
    const [faqs, total] = await this.faqService.findAllPaginated(query);
    const pageOptions = new PageOptionsDto();
    Object.assign(pageOptions, {
      page: query.page,
      take: query.limit,
    });
    return ResponseUtil.paginatedData(faqs, {
      pageOptions,
      itemCount: total,
    });
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active FAQs' })
  @ApiResponse({
    status: 200,
    description: 'List of active FAQs',
    type: [FaqResponseDto],
  })
  async findActive(): Promise<ResponseDto<FaqResponseDto[]>> {
    const faqs = await this.faqService.findAll();
    return ResponseUtil.success('Active FAQs retrieved successfully', faqs);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a FAQ by ID' })
  @ApiResponse({
    status: 200,
    description: 'FAQ details',
    type: FaqResponseDto,
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the faq',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({ status: 404, description: 'FAQ not found' })
  async findOne(
    @Param('id', ParseUUIDCustomPipe) id: string,
  ): Promise<ResponseDto<FaqResponseDto>> {
    const faq = await this.faqService.findOne(id);
    return ResponseUtil.success('FAQ retrieved successfully', faq);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a FAQ' })
  @ApiResponse({
    status: 200,
    description: 'FAQ updated successfully',
    type: FaqResponseDto,
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the faq',
    type: 'string',
    format: 'uuid',
  })
  async update(
    @Param('id', ParseUUIDCustomPipe) id: string,
    @Body() updateDto: UpdateFaqDto,
  ): Promise<ResponseDto<FaqResponseDto>> {
    const faq = await this.faqService.update(id, updateDto);
    return ResponseUtil.success('FAQ updated successfully', faq);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Toggle FAQ active status' })
  @ApiResponse({
    status: 200,
    description: 'FAQ status toggled successfully',
    type: FaqResponseDto,
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the FAQ',
    type: 'string',
    format: 'uuid',
  })
  async toggleStatus(
    @Param('id', ParseUUIDCustomPipe) id: string,
  ): Promise<ResponseDto<FaqResponseDto>> {
    const faq = await this.faqService.toggleStatus(id);
    return ResponseUtil.success('FAQ status toggled successfully', faq);
  }

  @Put(':id/reorder/:order')
  @ApiOperation({ summary: 'Reorder a FAQ' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the faq',
    type: 'string',
    format: 'uuid',
  })
  @ApiParam({
    name: 'order',
    description: 'The new order of the faq',
    type: 'number',
  })
  async reorder(
    @Param('id', ParseUUIDCustomPipe) id: string,
    @Param('order', ParseIntPipe) newOrder: number,
  ): Promise<ResponseDto<Faq>> {
    const faq = await this.faqService.reorder(id, newOrder);
    return ResponseUtil.success('FAQ reordered successfully', faq);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'The ID of the faq',
    type: 'string',
    format: 'uuid',
  })
  @ApiOperation({ summary: 'Delete a FAQ' })
  @ApiResponse({
    status: 200,
    description: 'FAQ deleted successfully',
  })
  async remove(
    @Param('id', ParseUUIDCustomPipe) id: string,
  ): Promise<ResponseDto<void>> {
    await this.faqService.remove(id);
    return ResponseUtil.success('FAQ deleted successfully', null);
  }
}
