import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/core/dtos/responses';
import { ResponseUtil } from 'src/core/utilities';
import { ParseUUIDCustomPipe } from 'src/core/pipes';
import { PageOptionsDto } from 'src/core/dtos/requests';
import { ApiPaginatedResponse } from 'src/core/decorators';
import { FaqResponseDto } from '../dto/responses';
import { FaqService } from '../services';
import { QueryFaqDto } from '../dto/requests';

@ApiTags('FAQ')
@Controller('faqs/public')
export class FaqPublicController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active FAQs with pagination and search' })
  @ApiPaginatedResponse(FaqResponseDto)
  async findActive(@Query() query: QueryFaqDto) {
    // Create a new query object with isActive set to true for public access
    const publicQuery = Object.assign(new QueryFaqDto(), query, {
      isActive: true,
    });

    const [faqs, total] = await this.faqService.findAllPaginated(publicQuery);
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

  @Get(':id')
  @ApiOperation({ summary: 'Get a FAQ by ID' })
  @ApiResponse({
    status: 200,
    description: 'FAQ details',
    type: FaqResponseDto,
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the FAQ',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({ status: 404, description: 'FAQ not found' })
  async findOne(
    @Param('id', ParseUUIDCustomPipe) id: string,
  ): Promise<ResponseDto<FaqResponseDto>> {
    const faq = await this.faqService.findOne(id);
    // Only return active FAQs to the public
    if (!faq.isActive) {
      throw new Error('FAQ not found or not active');
    }
    return ResponseUtil.success('FAQ retrieved successfully', faq);
  }
}
