export class ExecutePaymentResponseDto {
  /**
   * The invoice number that you can use to inquire about the invoice payment status later.
   */
  InvoiceId: number;

  /**
   * Indicates if this URL is for a Direct Payment method.
   * "true" or "false".
   */
  IsDirectPayment: boolean;

  /**
   * The URL to redirect the customer to or submit the card details for payment processing.
   */
  PaymentURL: string;

  /**
   * Refers to the order or transaction ID in your system that you have sent in the request earlier.
   */
  CustomerReference: string;

  /**
   * The custom field that you have passed in the request.
   */
  UserDefinedField: string;

  /**
   * If you set the RecurringModel array, the system will return the RecurringId value.
   */
  RecurringId: string;
}
