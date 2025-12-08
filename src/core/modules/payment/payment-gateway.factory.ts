import { Injectable } from '@nestjs/common';
import { PaymentGateway, PaymentGatewayFactory } from './interfaces';
import { FatoorahGateway } from './fatoorah/fatoorah.gateway';
import { TapGateway } from './tap/tap.gateway';

@Injectable()
export class PaymentGatewayFactoryService implements PaymentGatewayFactory {
  constructor(
    private readonly fatoorahGateway: FatoorahGateway,
    private readonly tapGateway: TapGateway,
  ) {}

  getGateway(gatewayName: string): PaymentGateway {
    switch (gatewayName.toLowerCase()) {
      case 'fatoorah':
        return this.fatoorahGateway;
      case 'tap':
        return this.tapGateway;
      default:
        throw new Error(`Payment gateway ${gatewayName} not supported`);
    }
  }
}
