import { CurrencyIsoEnum } from '../enums';

export class PaymentMethodListDto {
  InvoiceAmount: number = 1000;

  CurrencyIso: CurrencyIsoEnum = CurrencyIsoEnum.Kuwait;
}
