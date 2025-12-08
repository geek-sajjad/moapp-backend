import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/core/dtos/responses';
import { ResponseUtil } from 'src/core/utilities';
import { ParseUUIDCustomPipe } from 'src/core/pipes';
import { CmsService } from '../services/cms.service';
import { CmsPageResponseDto } from '../dto/responses/cms-page.response.dto';

@ApiTags('CMS')
@Controller('cms/public')
export class CmsPublicController {
  constructor(private readonly cmsService: CmsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all CMS pages' })
  @ApiResponse({
    status: 200,
    description: 'List of CMS pages',
    type: [CmsPageResponseDto],
  })
  async findAll(): Promise<ResponseDto<CmsPageResponseDto[]>> {
    const pages = await this.cmsService.findAll();
    return ResponseUtil.success('CMS pages retrieved successfully', pages);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a CMS page by id' })
  @ApiResponse({
    status: 200,
    description: 'CMS page details',
    type: CmsPageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Page not found' })
  async findOneById(
    @Param('id', ParseUUIDCustomPipe) id: string,
  ): Promise<ResponseDto<CmsPageResponseDto>> {
    const page = await this.cmsService.findOneById(id);
    return ResponseUtil.success('CMS page retrieved successfully', page);
  }
}
