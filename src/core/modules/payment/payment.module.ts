import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { PaymentService } from './payment.service';
import { PaymentGatewayFactoryService } from './payment-gateway.factory';
import { FatoorahGateway } from './fatoorah/fatoorah.gateway';
import { TapGateway } from './tap/tap.gateway';

@Global()
@Module({
  imports: [HttpModule],
  providers: [
    PaymentService,
    PaymentGatewayFactoryService,
    FatoorahGateway,
    TapGateway,
  ],
  controllers: [],
  exports: [PaymentService, PaymentGatewayFactoryService],
})
export class PaymentModule {}
