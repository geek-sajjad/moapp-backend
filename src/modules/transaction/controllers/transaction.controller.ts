import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard, SubscriptionGuard } from 'src/core/guards';
import { CurrentUser } from 'src/auth/decorators';
import { UserPayload } from 'src/core/types';
import { TransactionService } from '../services';
import { CreateTransactionDto } from '../dto/requests';
import {
  TransactionResponseDto,
  TransactionSummaryDto,
} from '../dto/responses';
import { RequireActiveSubscription } from 'src/core/decorators';

@ApiTags('Transactions')
@UseGuards(AuthGuard, SubscriptionGuard)
@ApiBearerAuth()
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @RequireActiveSubscription()
  @ApiOperation({ summary: 'Create a new transaction' })
  async create(
    @CurrentUser() user: UserPayload,
    @Body() createDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return await this.transactionService.create(user.id, createDto);
  }

  @Get('summary')
  @ApiOperation({
    summary: 'Get total summary of all transactions for current user',
  })
  async getUserTotalSummary(
    @CurrentUser() user: UserPayload,
  ): Promise<TransactionSummaryDto> {
    return await this.transactionService.getUserTotalSummary(user.id);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get all transactions for a customer' })
  @ApiParam({
    name: 'customerId',
    description: 'Customer ID',
    type: 'string',
    format: 'uuid',
  })
  async findAllByCustomer(
    @CurrentUser() user: UserPayload,
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ): Promise<TransactionResponseDto[]> {
    return await this.transactionService.findAllByCustomer(customerId, user.id);
  }

  @Get('customer/:customerId/summary')
  @ApiOperation({ summary: 'Get transaction summary for a customer' })
  @ApiParam({
    name: 'customerId',
    description: 'Customer ID',
    type: 'string',
    format: 'uuid',
  })
  async getCustomerSummary(
    @CurrentUser() user: UserPayload,
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ): Promise<TransactionSummaryDto> {
    return await this.transactionService.getCustomerSummary(
      customerId,
      user.id,
    );
  }

  @Get(':id/customer/:customerId')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiParam({
    name: 'id',
    description: 'Transaction ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiParam({
    name: 'customerId',
    description: 'Customer ID',
    type: 'string',
    format: 'uuid',
  })
  async findOne(
    @CurrentUser() user: UserPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ): Promise<TransactionResponseDto> {
    return await this.transactionService.findOne(id, customerId, user.id);
  }
}
