/* eslint-disable max-classes-per-file */
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEmail,
  IsDateString,
  IsPositive,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FatoorahInvoiceItemDto } from './invoice-item.dto';
import { InvoiceLang, InvoiceNotificationEnum } from '../enums';

export class CustomerAddressDto {
  @IsOptional()
  @IsString({ message: 'validation.IS_STRING' })
  Block?: string;

  @IsOptional()
  @IsString({ message: 'validation.IS_STRING' })
  Street?: string;

  @IsOptional()
  @IsString({ message: 'validation.IS_STRING' })
  HouseBuildingNo?: string;

  @IsOptional()
  @IsString({ message: 'validation.IS_STRING' })
  Address?: string;

  @IsOptional()
  @IsString({ message: 'validation.IS_STRING' })
  AddressInstructions?: string;
}

export class ConsigneeDto {
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsString({ message: 'validation.IS_STRING' })
  PersonName: string;

  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  Mobile: string;

  @IsOptional()
  @IsEmail({}, { message: 'validation.INVALID_EMAIL' })
  EmailAddress?: string;

  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsString({ message: 'validation.IS_STRING' })
  LineAddress: string;

  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsString({ message: 'validation.IS_STRING' })
  CityName: string;

  @IsOptional()
  @IsString({ message: 'validation.IS_STRING' })
  PostalCode?: string;

  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsString({ message: 'validation.IS_STRING' })
  CountryCode: string;
}

export class SupplierDto {
  @IsInt()
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  SupplierCode: number;

  @IsPositive()
  @IsOptional()
  ProposedShare?: number;

  @IsPositive()
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  InvoiceShare: number;
}

export class FatoorahInvoiceDto {
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsString({ message: 'validation.IS_STRING' })
  CustomerName: string;

  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsNumber({}, { message: 'validation.MUST_BE_NUMBER' })
  InvoiceValue: number;

  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsEnum(InvoiceNotificationEnum, { message: 'validation.INVALID_ENUM' })
  NotificationOption: InvoiceNotificationEnum;

  @IsOptional()
  @IsString({ message: 'validation.IS_STRING' })
  MobileCountryCode?: string;

  @IsOptional()
  CustomerMobile?: string;

  @IsOptional()
  @IsEmail({}, { message: 'validation.INVALID_EMAIL' })
  CustomerEmail?: string;

  @IsOptional()
  DisplayCurrencyIso?: string;

  @IsOptional()
  @IsString({ message: 'validation.IS_STRING' })
  CallBackUrl?: string;

  @IsOptional()
  @IsString({ message: 'validation.IS_STRING' })
  ErrorUrl?: string;

  @IsOptional()
  @IsEnum(InvoiceLang, { message: 'validation.INVALID_ENUM' })
  Language?: InvoiceLang;

  @IsOptional()
  @IsString({ message: 'validation.IS_STRING' })
  CustomerReference?: string;

  @IsOptional()
  @IsString({ message: 'validation.IS_STRING' })
  CustomerCivilId?: string;

  @IsOptional()
  @IsString({ message: 'validation.IS_STRING' })
  UserDefinedField?: string;

  @IsOptional()
  @IsArray({ message: 'validation.MUST_BE_ARRAY' })
  @ValidateNested({ each: true })
  @Type(() => CustomerAddressDto)
  CustomerAddress?: CustomerAddressDto[];

  @IsOptional()
  @IsDateString({}, { message: 'validation.INVALID_DATE' })
  ExpiryDate?: string;

  @IsOptional()
  @IsArray({ message: 'validation.MUST_BE_ARRAY' })
  @ValidateNested({ each: true })
  @Type(() => FatoorahInvoiceItemDto)
  InvoiceItems?: FatoorahInvoiceItemDto[];

  @IsOptional()
  @IsNumber({}, { message: 'validation.MUST_BE_NUMBER' })
  ShippingMethod?: number;

  @IsOptional()
  @IsArray({ message: 'validation.MUST_BE_ARRAY' })
  @ValidateNested({ each: true })
  @Type(() => ConsigneeDto)
  ShippingConsignee?: ConsigneeDto[];

  @IsOptional()
  @IsArray({ message: 'validation.MUST_BE_ARRAY' })
  @ValidateNested({ each: true })
  @Type(() => SupplierDto)
  Suppliers?: SupplierDto[];

  @IsOptional()
  @IsString({ message: 'validation.IS_STRING' })
  WebhookUrl?: string;

  @IsOptional()
  @IsArray({ message: 'validation.MUST_BE_ARRAY' })
  InvoicePaymentMethods?: number[];
}
