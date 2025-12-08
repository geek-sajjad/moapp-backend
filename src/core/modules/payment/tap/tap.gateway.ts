import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
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
export class TapGateway implements PaymentGateway {
  readonly name = 'tap';

  private readonly apiUrl: string;

  private readonly secretKey: string;

  private readonly httpService: HttpService;

  constructor(
    private readonly configService: ConfigService,
    httpService: HttpService,
  ) {
    this.apiUrl = this.configService.get<string>(
      'TAP_API_URL',
      'https://api.tap.company/v2',
    );
    this.secretKey = this.configService.get<string>('TAP_SECRET_KEY');
    this.httpService = httpService;

    if (!this.apiUrl) {
      throw new Error('TAP_API_URL is not configured');
    }

    if (!this.secretKey) {
      throw new Error('TAP_SECRET_KEY is not configured');
    }
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.secretKey}`,
      Accept: 'application/json',
    };
  }

  async getPaymentMethods(
    amount: number,
    currency: string,
  ): Promise<PaymentMethodsResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/payment-methods`, {
          headers: this.getHeaders(),
          params: {
            amount,
            currency,
          },
        }),
      );

      const { data } = response;
      const paymentMethods: PaymentMethod[] = (data?.payment_methods || []).map(
        (method: Record<string, unknown>) => ({
          id: method.id,
          name: method.name,
          code: method.code,
          isDirectPayment: method.direct_payment || false,
          currency: method.currency || currency,
        }),
      );

      return {
        paymentMethods,
        isSuccess: true,
        message: 'Payment methods retrieved successfully',
      };
    } catch (error) {
      if (error.response?.status === 401) {
        throw new UnauthorizedException(
          'Invalid TAP API credentials. Please check your secret key.',
        );
      }

      throw new HttpException(
        `TAP getPaymentMethods error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createInvoice(
    params: CreateInvoiceParams,
  ): Promise<CreateInvoiceResponse> {
    try {
      const body = {
        amount: params.amount,
        currency: params.currency,
        customer: {
          first_name: params.customerName.split(' ')[0] || params.customerName,
          last_name: params.customerName.split(' ').slice(1).join(' ') || '',
          email: params.customerEmail,
          phone: {
            country_code: '966',
            number: params.customerMobile || '',
          },
        },
        source: {
          id: 'src_all',
        },
        redirect: {
          url: params.callbackUrl,
        },
        post: {
          url: params.callbackUrl,
        },
        reference: {
          transaction: params.metadata?.reference || '',
        },
        description: params.description,
      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/charges`, body, {
          headers: this.getHeaders(),
        }),
      );

      const { data } = response;
      return {
        invoiceId: data.id,
        paymentUrl: data.transaction.url,
        isDirectPayment: false,
        gatewayInvoiceId: data.id,
      };
    } catch (error) {
      if (error.response?.status === 401) {
        throw new UnauthorizedException(
          'Invalid TAP API credentials. Please check your secret key.',
        );
      }

      throw new HttpException(
        `TAP createInvoice error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkPaymentStatus(
    params: PaymentStatusParams,
  ): Promise<PaymentStatusResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/charges/${params.invoiceId}`, {
          headers: this.getHeaders(),
        }),
      );

      const { data } = response;
      const status = data.status?.toLowerCase() || 'unknown';

      return {
        invoiceId: params.invoiceId,
        isPaid: status === 'captured' || status === 'authorized',
        status,
        rawStatus: data.status || 'UNKNOWN',
        customerReference: data.customer?.reference || null,
      };
    } catch (error) {
      if (error.response?.status === 401) {
        throw new UnauthorizedException(
          'Invalid TAP API credentials. Please check your secret key.',
        );
      }

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
      const body = {
        amount: params.amount,
        currency: params.currency,
        source: {
          id: params.paymentMethodId,
        },
        customer: {
          first_name: params.customerName.split(' ')[0] || params.customerName,
          last_name: params.customerName.split(' ').slice(1).join(' ') || '',
          email: params.customerEmail,
          phone: {
            country_code: '966',
            number: params.customerMobile || '',
          },
        },
        redirect: {
          url: params.callbackUrl,
        },
        post: {
          url: params.callbackUrl,
        },
        reference: {
          transaction: params.invoiceId,
        },
      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/charges`, body, {
          headers: this.getHeaders(),
        }),
      );

      const { data } = response;
      return {
        invoiceId: params.invoiceId,
        paymentUrl: data.transaction.url,
        isDirectPayment: false,
        gatewayInvoiceId: data.id,
      };
    } catch (error) {
      if (error.response?.status === 401) {
        throw new UnauthorizedException(
          'Invalid TAP API credentials. Please check your secret key.',
        );
      }

      throw new HttpException(
        `TAP executePayment error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refund(params: RefundParams): Promise<RefundResponse> {
    try {
      const body = {
        amount: params.amount,
        currency: 'KWD', // TAP default currency
        reason: 'customer_request',
      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/refunds`, body, {
          headers: this.getHeaders(),
        }),
      );

      const { data } = response;
      return {
        refundTransactionId: data.id,
        success: data.status === 'succeeded',
        message:
          data.status === 'succeeded' ? 'Refund successful' : 'Refund failed',
      };
    } catch (error) {
      if (error.response?.status === 401) {
        throw new UnauthorizedException(
          'Invalid TAP API credentials. Please check your secret key.',
        );
      }

      return {
        refundTransactionId: '',
        success: false,
        message: error.message,
      };
    }
  }
}
