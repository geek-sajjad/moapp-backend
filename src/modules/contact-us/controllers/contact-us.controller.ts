import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseUtil } from 'src/core/utilities';
import { Roles } from 'src/auth/decorators';
import { RoleEnum } from 'src/core/enums';
import { PaginationQueryDto } from 'src/core/dtos/requests';
import { AuthGuard, RolesGuard } from 'src/core/guards';
import { ParseUUIDCustomPipe } from 'src/core/pipes';
import { ContactUsResponseDto } from '../dto/responses/contact-us.response.dto';
import { RespondContactDto, UpdateContactStatusDto } from '../dto/requests';
import { ContactUsService } from '../services/contact-us.service';
import { ContactUsStatus } from '../entities/contact-us.entity';

@ApiTags('Contact Us')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.ADMIN)
@ApiBearerAuth()
@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Get('statuses')
  @ApiOperation({
    summary: 'Get available contact us statuses',
    description:
      'Returns a list of all available statuses for contact us messages',
  })
  @ApiResponse({
    status: 200,
    description: 'List of available statuses',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            type: 'string',
            enum: Object.values(ContactUsStatus),
          },
        },
      },
    },
  })
  async getStatuses() {
    const statuses = await this.contactUsService.getAvailableStatuses();
    return ResponseUtil.singleData(statuses);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact message by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the contact message',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Contact message retrieved successfully',
    type: ContactUsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  async findOne(@Param('id', ParseUUIDCustomPipe) id: string) {
    const contact = await this.contactUsService.findOne(id);
    return ResponseUtil.singleData(contact);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contact messages' })
  @ApiResponse({
    status: 200,
    description: 'List of contact messages',
    type: [ContactUsResponseDto],
  })
  async findAll(@Query() queryDto: PaginationQueryDto) {
    const [contacts, total] = await this.contactUsService.findAll(queryDto);

    return ResponseUtil.paginatedData(contacts, {
      itemCount: total,
      pageOptions: queryDto,
    });
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update contact message status' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the contact message',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Status updated successfully',
    type: ContactUsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  async updateStatus(
    @Param('id', ParseUUIDCustomPipe) id: string,
    @Body() updateStatusDto: UpdateContactStatusDto,
  ) {
    const result = await this.contactUsService.updateStatus(
      id,
      updateStatusDto,
    );
    return ResponseUtil.singleData(result);
  }

  @Patch(':id/respond')
  @ApiOperation({ summary: 'Respond to a contact message' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the contact message',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Response sent successfully',
    type: ContactUsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  async respond(
    @Param('id', ParseUUIDCustomPipe) id: string,
    @Body() respondDto: RespondContactDto,
  ) {
    const result = await this.contactUsService.respond(id, respondDto);
    return ResponseUtil.singleData(result);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact message' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the contact message',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Contact message deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  async remove(@Param('id', ParseUUIDCustomPipe) id: string) {
    await this.contactUsService.remove(id);
    return ResponseUtil.singleData(null);
  }
}
