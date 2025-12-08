/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentGatewayFactoryService } from './payment-gateway.factory';
import {
  CreateInvoiceParams,
  CreateInvoiceResponse,
  PaymentStatusParams,
  PaymentStatusResponse,
  ExecutePaymentParams,
  ExecutePaymentResponse,
  RefundParams,
  RefundResponse,
  PaymentMethodsResponse,
} from './interfaces';

@Injectable()
export class PaymentService {
  private defaultGateway: string;

  constructor(
    private readonly paymentGatewayFactory: PaymentGatewayFactoryService,
    private readonly configService: ConfigService,
  ) {
    this.defaultGateway = this.configService.get<string>(
      'DEFAULT_PAYMENT_GATEWAY',
      'fatoorah',
    );
  }

  async getPaymentMethods(
    amount: number,
    currency: string,
    gatewayName?: string,
  ): Promise<PaymentMethodsResponse> {
    const gateway = this.paymentGatewayFactory.getGateway(
      gatewayName || this.defaultGateway,
    );
    return gateway.getPaymentMethods(amount, currency);
  }

  async createInvoice(
    params: CreateInvoiceParams,
    gatewayName?: string,
  ): Promise<CreateInvoiceResponse> {
    const gateway = this.paymentGatewayFactory.getGateway(
      gatewayName || this.defaultGateway,
    );
    return gateway.createInvoice(params);
  }

  async checkPaymentStatus(
    params: PaymentStatusParams,
    gatewayName?: string,
  ): Promise<PaymentStatusResponse> {
    const gateway = this.paymentGatewayFactory.getGateway(
      gatewayName || this.defaultGateway,
    );
    return gateway.checkPaymentStatus(params);
  }

  async executePayment(
    params: ExecutePaymentParams,
    gatewayName?: string,
  ): Promise<ExecutePaymentResponse> {
    const gateway = this.paymentGatewayFactory.getGateway(
      gatewayName || this.defaultGateway,
    );
    return gateway.executePayment(params);
  }

  async refund(
    params: RefundParams,
    gatewayName?: string,
  ): Promise<RefundResponse> {
    const gateway = this.paymentGatewayFactory.getGateway(
      gatewayName || this.defaultGateway,
    );
    return gateway.refund(params);
  }
}
