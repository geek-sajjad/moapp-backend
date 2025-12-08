/* eslint-disable max-classes-per-file */
class CreateInvoiceResponseData {
  InvoiceId: number;

  InvoiceURL: string;

  CustomerReference: string;

  UserDefinedField: object;
}

export class FatoorahCreateInvoiceResponseDto {
  IsSuccess: boolean;

  Message: string;

  ValidationErrors: unknown;

  Data: CreateInvoiceResponseData;
}
