/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PaymentMethod {
  id: string;
  name: string;
  code: string;
  isDirectPayment: boolean;
  currency: string;
}

export interface PaymentMethodsResponse {
  paymentMethods: PaymentMethod[];
  isSuccess: boolean;
  message?: string;
}

export interface CreateInvoiceParams {
  amount: number;
  currency: string;
  description: string;
  customerName: string;
  customerEmail: string;
  customerMobile?: string;
  callbackUrl: string;
  errorUrl: string;
  metadata?: Record<string, any>;
}

export interface CreateInvoiceResponse {
  invoiceId: string;
  paymentUrl: string;
  isDirectPayment: boolean;
  gatewayInvoiceId: string;
}

export interface PaymentStatusParams {
  invoiceId: string;
}

export interface PaymentStatusResponse {
  invoiceId: string;
  isPaid: boolean;
  status: string;
  rawStatus: string;
  customerReference: string | null;
}

export interface ExecutePaymentParams {
  paymentMethodId: string;
  invoiceId: string;
  customerName: string;
  customerEmail: string;
  customerMobile?: string;
  amount: number;
  currency: string;
  callbackUrl: string;
  errorUrl: string;
}

export interface ExecutePaymentResponse {
  invoiceId: string;
  paymentUrl: string;
  isDirectPayment: boolean;
  gatewayInvoiceId: string;
}

export interface RefundParams {
  transactionId: string;
  amount: number;
}

export interface RefundResponse {
  refundTransactionId: string;
  success: boolean;
  message?: string;
}

export interface PaymentGateway {
  name: string;

  getPaymentMethods(
    amount: number,
    currency: string,
  ): Promise<PaymentMethodsResponse>;

  createInvoice(params: CreateInvoiceParams): Promise<CreateInvoiceResponse>;

  checkPaymentStatus(
    params: PaymentStatusParams,
  ): Promise<PaymentStatusResponse>;

  executePayment(params: ExecutePaymentParams): Promise<ExecutePaymentResponse>;

  refund(params: RefundParams): Promise<RefundResponse>;
}
