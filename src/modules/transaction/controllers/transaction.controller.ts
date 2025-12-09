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
import { TransactionService } from '../services';
import { CreateTransactionDto, UpdateTransactionDto } from '../dto/requests';
import {
  TransactionResponseDto,
  TransactionSummaryDto,
} from '../dto/responses';

@ApiTags('Transactions')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  async create(
    @CurrentUser() user: UserPayload,
    @Body() createDto: CreateTransactionDto,
  ): Promise<ResponseDto<TransactionResponseDto>> {
    const transaction = await this.transactionService.create(
      user.id,
      createDto,
    );
    return ResponseUtil.success('message.TRANSACTION.CREATED', transaction);
  }

  @Get('summary')
  @ApiOperation({
    summary: 'Get total summary of all transactions for current user',
  })
  async getUserTotalSummary(
    @CurrentUser() user: UserPayload,
  ): Promise<ResponseDto<TransactionSummaryDto>> {
    const summary = await this.transactionService.getUserTotalSummary(user.id);
    return ResponseUtil.success(
      'message.TRANSACTION.SUMMARY_RETRIEVED',
      summary,
    );
  }

  @Get('contact/:contactId')
  @ApiOperation({ summary: 'Get all transactions for a contact' })
  @ApiParam({
    name: 'contactId',
    description: 'Contact ID',
    type: 'string',
    format: 'uuid',
  })
  async findAllByContact(
    @CurrentUser() user: UserPayload,
    @Param('contactId', ParseUUIDCustomPipe) contactId: string,
  ): Promise<ResponseDto<TransactionResponseDto[]>> {
    const transactions = await this.transactionService.findAllByContact(
      contactId,
      user.id,
    );
    return ResponseUtil.success('message.TRANSACTION.RETRIEVED', transactions);
  }

  @Get('contact/:contactId/summary')
  @ApiOperation({ summary: 'Get transaction summary for a contact' })
  @ApiParam({
    name: 'contactId',
    description: 'Contact ID',
    type: 'string',
    format: 'uuid',
  })
  async getContactSummary(
    @CurrentUser() user: UserPayload,
    @Param('contactId', ParseUUIDCustomPipe) contactId: string,
  ): Promise<ResponseDto<TransactionSummaryDto>> {
    const summary = await this.transactionService.getContactSummary(
      contactId,
      user.id,
    );
    return ResponseUtil.success(
      'message.TRANSACTION.SUMMARY_RETRIEVED',
      summary,
    );
  }

  @Get(':id/contact/:contactId')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiParam({
    name: 'id',
    description: 'Transaction ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiParam({
    name: 'contactId',
    description: 'Contact ID',
    type: 'string',
    format: 'uuid',
  })
  async findOne(
    @CurrentUser() user: UserPayload,
    @Param('id', ParseUUIDCustomPipe) id: string,
    @Param('contactId', ParseUUIDCustomPipe) contactId: string,
  ): Promise<ResponseDto<TransactionResponseDto>> {
    const transaction = await this.transactionService.findOne(
      id,
      contactId,
      user.id,
    );
    return ResponseUtil.success(
      'message.TRANSACTION.GET_TRANSACTION',
      transaction,
    );
  }

  @Patch(':id/contact/:contactId')
  @ApiOperation({ summary: 'Update transaction' })
  @ApiParam({
    name: 'id',
    description: 'Transaction ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiParam({
    name: 'contactId',
    description: 'Contact ID',
    type: 'string',
    format: 'uuid',
  })
  async update(
    @CurrentUser() user: UserPayload,
    @Param('id', ParseUUIDCustomPipe) id: string,
    @Param('contactId', ParseUUIDCustomPipe) contactId: string,
    @Body() updateDto: UpdateTransactionDto,
  ): Promise<ResponseDto<TransactionResponseDto>> {
    const transaction = await this.transactionService.update(
      id,
      contactId,
      user.id,
      updateDto,
    );
    return ResponseUtil.success(
      'message.TRANSACTION.UPDATE_SUCCEED',
      transaction,
    );
  }

  @Delete(':id/contact/:contactId')
  @ApiOperation({ summary: 'Delete transaction' })
  @ApiParam({
    name: 'id',
    description: 'Transaction ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiParam({
    name: 'contactId',
    description: 'Contact ID',
    type: 'string',
    format: 'uuid',
  })
  async remove(
    @CurrentUser() user: UserPayload,
    @Param('id', ParseUUIDCustomPipe) id: string,
    @Param('contactId', ParseUUIDCustomPipe) contactId: string,
  ): Promise<ResponseDto<boolean>> {
    const result = await this.transactionService.delete(id, contactId, user.id);
    return ResponseUtil.success('message.TRANSACTION.DELETE_SUCCESS', result);
  }
}
