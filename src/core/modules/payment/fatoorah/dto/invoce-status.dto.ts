import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { InvoiceIdentifier } from '../enums';

export class FatoorahInvoiceStatusDto {
  @IsString({ message: 'validation.NOT_EMPTY' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  key: string;

  @IsEnum(InvoiceIdentifier, { message: 'validation.INVALID_IDENTIFIER' })
  KeyType: InvoiceIdentifier = InvoiceIdentifier.PaymentId;
}
