export class PaymentMethodResponseDto {
  PaymentMethodId: number; // ID of the payment method

  PaymentMethodAr: string; // Name of the payment method in Arabic

  PaymentMethodEn: string; // Name of the payment method in English

  PaymentMethodCode: string; // Code for the payment method

  IsDirectPayment: boolean; // Indicates if it's a direct payment method

  ServiceCharge: number; // Service charge for the payment

  TotalAmount: number; // Total amount for the transaction

  CurrencyIso: string | null; // ISO code of the currency

  ImageUrl: string; // URL of the payment method image

  IsEmbeddedSupported: boolean; // Whether the method supports embedded payments

  PaymentCurrencyIso: string; // ISO code of the payment currency
}
