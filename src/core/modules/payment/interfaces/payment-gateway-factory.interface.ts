import { PaymentGateway } from './payment-gateway.interface';

export interface PaymentGatewayFactory {
  getGateway(gatewayName: string): PaymentGateway;
}
