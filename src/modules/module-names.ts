import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
import { CustomerModule } from './customer/customer.module';
import { HealthModule } from 'src/core/modules/health/health.module';

export const LIST_OF_MODULES = [
  UserModule,
  TransactionModule,
  CustomerModule,
  HealthModule,
];
