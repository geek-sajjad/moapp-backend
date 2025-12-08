# Payment Module (Core)

This module provides a comprehensive payment system for the backend-template, supporting multiple payment gateways including MyFatoorah and Tap. It has been refactored to follow the core module patterns and is now part of the core modules structure.

## Features

- **Multi-gateway support**: MyFatoorah and Tap payment gateways
- **Payment method discovery**: Get available payment methods for different amounts and currencies
- **Invoice creation**: Create payment invoices with customizable parameters
- **Payment execution**: Execute payments with specific payment methods
- **Status tracking**: Track payment status in real-time
- **Refund support**: Process refunds for completed payments
- **Factory pattern**: Easy gateway switching and management
- **Global module**: Available throughout the application

## Supported Gateways

### MyFatoorah (Fatoorah)
- Middle East focused payment gateway
- Supports multiple payment methods
- Real-time payment status updates
- Refund capabilities

### Tap
- Kuwait-based payment gateway
- Modern API with comprehensive features
- Multiple payment method support
- Advanced refund processing

## Architecture

### Core Components

1. **Interfaces** (`interfaces/`)
   - `PaymentGateway`: Unified interface for all payment gateways
   - `PaymentGatewayFactory`: Factory interface for gateway management
   - Various parameter and response interfaces

2. **Gateways** (`fatoorah/`, `tap/`)
   - `FatoorahGateway`: MyFatoorah payment gateway implementation
   - `TapGateway`: Tap payment gateway implementation
   - Both implement the unified `PaymentGateway` interface

3. **Factory** (`payment-gateway.factory.ts`)
   - `PaymentGatewayFactoryService`: Factory service for gateway selection
   - Supports dynamic gateway switching

4. **Service** (`payment.service.ts`)
   - `PaymentService`: Main business logic service
   - Handles all payment operations with gateway abstraction

5. **Controller** (`payment.controller.ts`)
   - `PaymentController`: REST API endpoints
   - Provides HTTP interface for payment operations

## API Endpoints

### Payment Methods
- `GET /payments/methods` - Get available payment methods

### Invoices
- `POST /payments/invoice` - Create a payment invoice

### Payment Management
- `POST /payments/status` - Check payment status
- `POST /payments/execute` - Execute a payment
- `POST /payments/refund` - Refund a payment

## Configuration

### Environment Variables

#### MyFatoorah
```env
FATOORAH_API_KEY=your_fatoorah_api_key
FATOORA_API_URL=https://api.myfatoorah.com
```

#### Tap
```env
TAP_API_URL=https://api.tap.company/v2
TAP_SECRET_KEY=your_tap_secret_key
```

#### General
```env
DEFAULT_PAYMENT_GATEWAY=fatoorah
```

## Usage

### Service Usage

```typescript
import { PaymentService } from 'src/core/modules/payment/payment.service';

@Injectable()
export class YourService {
  constructor(private readonly paymentService: PaymentService) {}

  async createPayment() {
    const invoice = await this.paymentService.createInvoice({
      amount: 100.50,
      currency: 'USD',
      description: 'Payment for order #12345',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerMobile: '+966501234567',
      callbackUrl: 'https://your-app.com/callback',
      errorUrl: 'https://your-app.com/error',
      metadata: { orderId: '12345' }
    }, 'fatoorah'); // optional gateway parameter

    return invoice;
  }

  async getMethods() {
    const methods = await this.paymentService.getPaymentMethods(
      100.50,
      'USD',
      'tap'
    );
    return methods;
  }

  async checkStatus() {
    const status = await this.paymentService.checkPaymentStatus({
      invoiceId: 'inv_12345'
    }, 'fatoorah');
    return status;
  }

  async processRefund() {
    const refund = await this.paymentService.refund({
      transactionId: 'txn_12345',
      amount: 50.25
    }, 'tap');
    return refund;
  }
}
```

### Gateway Factory Usage

```typescript
import { PaymentGatewayFactoryService } from 'src/core/modules/payment/payment-gateway.factory';

@Injectable()
export class YourService {
  constructor(private readonly gatewayFactory: PaymentGatewayFactoryService) {}

  async useSpecificGateway() {
    const gateway = this.gatewayFactory.getGateway('tap');
    const methods = await gateway.getPaymentMethods(100, 'USD');
    return methods;
  }
}
```

## Module Registration

The payment module is automatically registered as a global module in the core modules:

```typescript
// src/core/modules/core-module-names.ts
import { PaymentModule } from 'src/core/modules/payment/payment.module';

export const LIST_OF_CORE_MODULES = [
  // ... other modules
  PaymentModule,
  // ... other modules
];
```

## Error Handling

The module includes comprehensive error handling for:
- Invalid payment gateway configurations
- API communication failures
- Payment processing errors
- Refund processing issues
- Gateway selection errors

## Security

- Secure API key management through environment variables
- Input validation and sanitization
- Proper error message handling (no sensitive data exposure)
- Gateway-specific authentication handling

## Dependencies

- `@nestjs/axios` for HTTP requests to payment gateways
- `@nestjs/config` for configuration management
- `rxjs` for HTTP request handling
- `@nestjs/swagger` for API documentation

## Migration from Modules

This module was refactored from `src/modules/payment` to `src/core/modules/payment` to:
- Follow core module patterns
- Provide global availability
- Improve maintainability
- Standardize interfaces
- Support multiple gateways with factory pattern

The old module structure has been removed and all functionality is now available through the core module. 