import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import {
  PaymentGateway,
  PaymentMethodsResponse,
  CreateInvoiceParams,
  CreateInvoiceResponse,
  PaymentStatusParams,
  PaymentStatusResponse,
  ExecutePaymentParams,
  ExecutePaymentResponse,
  RefundParams,
  RefundResponse,
  PaymentMethod,
} from '../interfaces';

@Injectable()
export class FatoorahGateway implements PaymentGateway {
  readonly name = 'fatoorah';

  private readonly apiKey: string;

  private readonly baseUrl: string;

  private readonly httpService: HttpService;

  constructor(
    private readonly configService: ConfigService,
    httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>('FATOORAH_API_KEY');
    this.baseUrl = this.configService.get<string>('FATOORA_API_URL');
    this.httpService = httpService;

    if (!this.apiKey) {
      throw new Error('FATOORAH_API_KEY is not configured');
    }

    if (!this.baseUrl) {
      throw new Error('FATOORA_API_URL is not configured');
    }
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  async getPaymentMethods(
    amount: number,
    currency: string,
  ): Promise<PaymentMethodsResponse> {
    try {
      const url = `${this.baseUrl}/v2/InitiatePayment`;
      const body = {
        InvoiceAmount: amount,
        CurrencyIso: currency,
      };

      const response = await firstValueFrom(
        this.httpService.post(url, body, { headers: this.getHeaders() }),
      );

      const { data } = response;
      if (data?.IsSuccess) {
        const paymentMethods: PaymentMethod[] = (
          data.Data.PaymentMethods || []
        ).map((method: Record<string, unknown>) => ({
          id: method.PaymentMethodId.toString(),
          name: method.PaymentMethodEn,
          code: method.PaymentMethodCode,
          isDirectPayment: method.IsDirectPayment,
          currency: method.PaymentCurrencyIso,
        }));

        return {
          paymentMethods,
          isSuccess: true,
          message: data.Message,
        };
      }

      return {
        paymentMethods: [],
        isSuccess: false,
        message: data?.Message || 'Failed to retrieve payment methods',
      };
    } catch (error) {
      throw new HttpException(
        `Fatoorah getPaymentMethods error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createInvoice(
    params: CreateInvoiceParams,
  ): Promise<CreateInvoiceResponse> {
    try {
      const url = `${this.baseUrl}/v2/ExecutePayment`;
      const body = {
        PaymentMethodId: 1, // Default payment method
        CustomerName: params.customerName,
        DisplayCurrencyIso: params.currency,
        CustomerMobile: params.customerMobile || '',
        CustomerEmail: params.customerEmail,
        InvoiceValue: params.amount,
        CustomerReference: params.metadata?.reference || '',
        Language: 'EN',
        CallBackUrl: params.callbackUrl,
        ErrorUrl: params.errorUrl,
      };

      const response = await firstValueFrom(
        this.httpService.post(url, body, { headers: this.getHeaders() }),
      );

      const { data } = response;
      if (data?.IsSuccess) {
        return {
          invoiceId: data.Data.InvoiceId.toString(),
          paymentUrl: data.Data.PaymentURL,
          isDirectPayment: data.Data.IsDirectPayment,
          gatewayInvoiceId: data.Data.InvoiceId.toString(),
        };
      }

      throw new HttpException(
        `Fatoorah createInvoice failed: ${data?.Message || 'Unknown error'}`,
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      throw new HttpException(
        `Fatoorah createInvoice error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkPaymentStatus(
    params: PaymentStatusParams,
  ): Promise<PaymentStatusResponse> {
    try {
      const url = `${this.baseUrl}/v2/GetPaymentStatus`;
      const body = {
        Key: params.invoiceId,
        KeyType: 'PaymentId',
      };

      const response = await firstValueFrom(
        this.httpService.post(url, body, { headers: this.getHeaders() }),
      );

      const { data } = response;
      if (data?.IsSuccess) {
        const invoiceStatus = data.Data.InvoiceStatus || '';
        return {
          invoiceId: params.invoiceId,
          isPaid: invoiceStatus.toLowerCase() === 'paid',
          status: invoiceStatus.toLowerCase(),
          rawStatus: invoiceStatus,
          customerReference: data.Data?.CustomerReference || null,
        };
      }

      return {
        invoiceId: params.invoiceId,
        isPaid: false,
        status: 'unknown',
        rawStatus: 'UNKNOWN',
        customerReference: data.Data?.CustomerReference || null,
      };
    } catch {
      return {
        invoiceId: params.invoiceId,
        isPaid: false,
        status: 'error',
        rawStatus: 'ERROR',
        customerReference: null,
      };
    }
  }

  async executePayment(
    params: ExecutePaymentParams,
  ): Promise<ExecutePaymentResponse> {
    try {
      const url = `${this.baseUrl}/v2/ExecutePayment`;
      const body = {
        PaymentMethodId: parseInt(params.paymentMethodId, 10),
        CustomerName: params.customerName,
        DisplayCurrencyIso: params.currency,
        CustomerMobile: params.customerMobile || '',
        CustomerEmail: params.customerEmail,
        InvoiceValue: params.amount,
        CustomerReference: params.invoiceId,
        Language: 'EN',
        CallBackUrl: params.callbackUrl,
        ErrorUrl: params.errorUrl,
      };

      const response = await firstValueFrom(
        this.httpService.post(url, body, { headers: this.getHeaders() }),
      );

      const { data } = response;
      if (data?.IsSuccess) {
        return {
          invoiceId: params.invoiceId,
          paymentUrl: data.Data.PaymentURL,
          isDirectPayment: data.Data.IsDirectPayment,
          gatewayInvoiceId: data.Data.InvoiceId.toString(),
        };
      }

      throw new HttpException(
        `Fatoorah executePayment failed: ${data?.Message || 'Unknown error'}`,
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      console.log(error?.response?.data);
      throw new HttpException(
        `Fatoorah executePayment error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refund(params: RefundParams): Promise<RefundResponse> {
    try {
      const url = `${this.baseUrl}/v2/RefundPayment`;
      const body = {
        Key: params.transactionId,
        KeyType: 'PaymentId',
        Amount: params.amount,
      };

      const response = await firstValueFrom(
        this.httpService.post(url, body, { headers: this.getHeaders() }),
      );

      const { data } = response;
      if (data?.IsSuccess) {
        return {
          refundTransactionId: data.Data.RefundId || '',
          success: true,
          message: data.Message,
        };
      }

      return {
        refundTransactionId: '',
        success: false,
        message: data?.Message || 'Refund failed',
      };
    } catch (error) {
      return {
        refundTransactionId: '',
        success: false,
        message: error.message,
      };
    }
  }
}
