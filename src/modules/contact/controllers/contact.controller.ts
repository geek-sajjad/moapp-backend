import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/core/dtos/responses';
import { ResponseUtil } from 'src/core/utilities';
import { AuthGuard } from 'src/core/guards';
import { ParseUUIDCustomPipe } from 'src/core/pipes';
import { CurrentUser } from 'src/auth/decorators';
import { UserPayload } from 'src/core/types';
import { ContactService } from '../services';
import { CreateContactDto, UpdateContactDto } from '../dto/requests';
import { ContactResponseDto, ContactWithBalanceDto } from '../dto/responses';

@ApiTags('Contacts')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  async create(
    @CurrentUser() user: UserPayload,
    @Body() createDto: CreateContactDto,
  ): Promise<ResponseDto<ContactResponseDto>> {
    const contact = await this.contactService.create(user.id, createDto);
    return ResponseUtil.success('message.CONTACT.CREATED', contact);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contacts for current user' })
  async findAll(
    @CurrentUser() user: UserPayload,
  ): Promise<ResponseDto<ContactResponseDto[]>> {
    const contacts = await this.contactService.findAllByUser(user.id);
    return ResponseUtil.success('message.CONTACT.RETRIEVED', contacts);
  }

  @Get('with-balance')
  @ApiOperation({
    summary: 'Get all contacts with balance information for current user',
  })
  async findAllWithBalance(
    @CurrentUser() user: UserPayload,
  ): Promise<ResponseDto<ContactWithBalanceDto[]>> {
    const contacts = await this.contactService.findAllWithBalance(user.id);
    return ResponseUtil.success('message.CONTACT.RETRIEVED', contacts);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact by ID' })
  @ApiParam({
    name: 'id',
    description: 'Contact ID',
    type: 'string',
    format: 'uuid',
  })
  async findOne(
    @CurrentUser() user: UserPayload,
    @Param('id', ParseUUIDCustomPipe) id: string,
  ): Promise<ResponseDto<ContactResponseDto>> {
    const contact = await this.contactService.findOne(id, user.id);
    return ResponseUtil.success('message.CONTACT.GET_CONTACT', contact);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update contact' })
  @ApiParam({
    name: 'id',
    description: 'Contact ID',
    type: 'string',
    format: 'uuid',
  })
  async update(
    @CurrentUser() user: UserPayload,
    @Param('id', ParseUUIDCustomPipe) id: string,
    @Body() updateDto: UpdateContactDto,
  ): Promise<ResponseDto<ContactResponseDto>> {
    const contact = await this.contactService.update(id, user.id, updateDto);
    return ResponseUtil.success('message.CONTACT.UPDATE_SUCCEED', contact);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contact' })
  @ApiParam({
    name: 'id',
    description: 'Contact ID',
    type: 'string',
    format: 'uuid',
  })
  async remove(
    @CurrentUser() user: UserPayload,
    @Param('id', ParseUUIDCustomPipe) id: string,
  ): Promise<ResponseDto<boolean>> {
    const result = await this.contactService.delete(id, user.id);
    return ResponseUtil.success('message.CONTACT.DELETE_SUCCESS', result);
  }
}
