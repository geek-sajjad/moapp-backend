/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ResponseUtil } from 'src/core/utilities';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import {
  CreateInvoiceParams,
  PaymentStatusParams,
  ExecutePaymentParams,
  RefundParams,
} from './interfaces';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('methods')
  @ApiOperation({ summary: 'Get available payment methods' })
  async getPaymentMethods(
    @Query('amount') amount: number,
    @Query('currency') currency: string,
    @Query('gateway') gateway?: string,
  ) {
    try {
      const methods = await this.paymentService.getPaymentMethods(
        amount,
        currency,
        gateway,
      );
      return ResponseUtil.success(
        'Payment methods retrieved successfully',
        methods,
      );
    } catch {
      throw new HttpException(
        'Failed to retrieve payment methods',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('invoice')
  @ApiOperation({ summary: 'Create a payment invoice' })
  async createInvoice(
    @Body() params: CreateInvoiceParams,
    @Query('gateway') gateway?: string,
  ) {
    try {
      const payment = await this.paymentService.createInvoice(params, gateway);
      return ResponseUtil.success('Invoice created successfully', payment);
    } catch {
      throw new HttpException(
        'Failed to create invoice',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('status')
  @ApiOperation({ summary: 'Check payment status' })
  async checkPaymentStatus(
    @Body() params: PaymentStatusParams,
    @Query('gateway') gateway?: string,
  ) {
    try {
      const status = await this.paymentService.checkPaymentStatus(
        params,
        gateway,
      );
      return ResponseUtil.success(
        'Payment status retrieved successfully',
        status,
      );
    } catch {
      throw new HttpException(
        'Failed to check payment status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('execute')
  @ApiOperation({ summary: 'Execute a payment' })
  async executePayment(
    @Body() params: ExecutePaymentParams,
    @Query('gateway') gateway?: string,
  ) {
    try {
      const result = await this.paymentService.executePayment(params, gateway);
      return ResponseUtil.success('Payment executed successfully', result);
    } catch {
      throw new HttpException(
        'Failed to execute payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('refund')
  @ApiOperation({ summary: 'Refund a payment' })
  async refund(
    @Body() params: RefundParams,
    @Query('gateway') gateway?: string,
  ) {
    try {
      const refund = await this.paymentService.refund(params, gateway);
      return ResponseUtil.success('Refund processed successfully', refund);
    } catch {
      throw new HttpException(
        'Failed to process refund',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
