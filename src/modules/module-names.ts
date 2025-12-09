import { UserModule } from './user/user.module';
import { ContactModule } from './contact/contact.module';
import { TransactionModule } from './transaction/transaction.module';
// import { MessageModule } from './messaging/message.module';
// import { TestCoreModule } from './testCoreModules/test-core-modules.module';
// import { CmsModule } from './cms/cms.module';
// import { ContactUsModule } from './contact-us/contact-us.module';
// import { FaqModule } from './faq/faq.module';
// import { PaymentModule } from './payment/payment.module';
// import { DiscountModule } from './discount/discount.module';
import { HealthModule } from 'src/core/modules/health/health.module';

export const LIST_OF_MODULES = [
  // PaymentModule,
  UserModule,
  ContactModule,
  TransactionModule,
  // DiscountModule,
  // MessageModule,
  // TestCoreModule,
  // CmsModule,
  // ContactUsModule,
  // FaqModule,
  HealthModule,
];
