import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CurrencyIsoEnum, InvoiceLang } from '../enums';
import { FatoorahInvoiceItemDto } from './invoice-item.dto';
import { SupplierDto } from './invoice.dto';

export class ExecutePaymentDto {
  /**
   * The amount you are seeking to charge the customer.
   * Accepts decimal values, e.g., 2.500.
   */
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsNumber({ maxDecimalPlaces: 3 }, { message: 'validation.MUST_BE_NUMBER' })
  InvoiceValue: number;

  /**
   * ID of the payment method.
   * Not required if "SessionId" is provided.
   * Example: 2 for VISA/MASTER payment method.
   */
  @IsOptional()
  @IsNumber({}, { message: 'validation.MUST_BE_NUMBER' })
  PaymentMethodId?: number;

  /**
   * Session ID for the payment.
   * Not required if "PaymentMethodId" is provided.
   * Used for embedded payment scenarios.
   */
  @IsOptional()
  @IsString({ message: 'validation.IS_STRING' })
  SessionId?: string;

  @IsOptional()
  @IsString({ message: 'validation.IS_STRING' })
  CustomerName?: string;

  @IsOptional()
  @IsString({ message: 'validation.IS_STRING' })
  CallBackUrl?: string;

  @IsOptional()
  @IsString({ message: 'validation.IS_STRING' })
  ErrorUrl?: string;

  @IsOptional()
  @IsString({ message: 'validation.IS_STRING' })
  CustomerMobile?: string;

  @IsOptional()
  @IsString({ message: 'validation.IS_STRING' })
  CustomerEmail?: string;

  @IsOptional()
  @IsString({ message: 'validation.IS_STRING' })
  ExpiryDate?: string;

  @IsOptional()
  @IsString({ message: 'validation.IS_STRING' })
  WebhookUrl?: string;

  @IsOptional()
  @IsEnum(InvoiceLang)
  Language?: InvoiceLang;

  @IsOptional()
  @IsEnum(CurrencyIsoEnum)
  DisplayCurrencyIso?: CurrencyIsoEnum;

  @IsOptional()
  @IsArray({ message: 'validation.MUST_BE_ARRAY' })
  @ValidateNested({ each: true })
  @Type(() => FatoorahInvoiceItemDto)
  InvoiceItems?: FatoorahInvoiceItemDto[];

  @IsOptional()
  @IsArray({ message: 'validation.MUST_BE_ARRAY' })
  @ValidateNested({ each: true })
  @Type(() => SupplierDto)
  Suppliers?: SupplierDto[];
}
