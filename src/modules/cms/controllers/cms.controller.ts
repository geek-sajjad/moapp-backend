import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
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
import { PaginationQueryDto } from 'src/core/dtos/requests';
import { ParseUUIDCustomPipe } from 'src/core/pipes';
import { CmsService } from '../services/cms.service';
import { CreateCmsPageDto } from '../dto/requests/create-cms-page.dto';
import { UpdateCmsPageDto } from '../dto/requests/update-cms-page.dto';
import { CmsPageResponseDto } from '../dto/responses/cms-page.response.dto';
import { UpdateStatusCmsPageDto } from '../dto/requests';

@ApiTags('CMS')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.ADMIN)
@ApiBearerAuth()
@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new CMS page' })
  @ApiResponse({
    status: 201,
    description: 'CMS page created successfully',
    type: CmsPageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - duplicate slug or title',
  })
  async create(
    @Body() createDto: CreateCmsPageDto,
  ): Promise<ResponseDto<CmsPageResponseDto>> {
    const page = await this.cmsService.create(createDto);
    return ResponseUtil.success('CMS page created successfully', page);
  }

  @Get()
  @ApiOperation({ summary: 'Get all CMS pages with search and sort options' })
  @ApiResponse({
    status: 200,
    description: 'List of CMS pages',
    type: [CmsPageResponseDto],
  })
  async findAll(@Query() query: PaginationQueryDto) {
    const [pages, total] = await this.cmsService.findAllPaginated(query);
    return ResponseUtil.paginatedData(pages, {
      pageOptions: query,
      itemCount: total,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a CMS page by id' })
  @ApiResponse({
    status: 200,
    description: 'CMS page details',
    type: CmsPageResponseDto,
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the CMS page to retrieve',
    type: 'string',
  })
  @ApiResponse({ status: 404, description: 'Page not found' })
  async findOne(
    @Param('id', ParseUUIDCustomPipe) id: string,
  ): Promise<ResponseDto<CmsPageResponseDto>> {
    const page = await this.cmsService.findOneById(id);
    return ResponseUtil.success('CMS page retrieved successfully', page);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a CMS page' })
  @ApiParam({
    name: 'id',
    description: 'The id of the CMS page to update',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'CMS page updated successfully',
    type: CmsPageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - duplicate slug or title',
  })
  async update(
    @Param('id', ParseUUIDCustomPipe) id: string,
    @Body() updateDto: UpdateCmsPageDto,
  ) {
    const page = await this.cmsService.update(id, updateDto);
    return ResponseUtil.singleData(page);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update the status of a CMS page' })
  @ApiParam({
    name: 'id',
    description: 'The id of the CMS page to update',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'CMS page status updated successfully',
    type: CmsPageResponseDto,
  })
  async updateStatus(
    @Param('id', ParseUUIDCustomPipe) id: string,
    @Body() updateDto: UpdateStatusCmsPageDto,
  ) {
    const page = await this.cmsService.updateStatus(id, updateDto);
    return ResponseUtil.singleData(page);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'The id of the CMS page to delete',
    type: 'string',
  })
  @ApiOperation({ summary: 'Delete a CMS page' })
  async remove(@Param('id', ParseUUIDCustomPipe) id: string) {
    await this.cmsService.remove(id);
    return ResponseUtil.singleData(true);
  }
}
