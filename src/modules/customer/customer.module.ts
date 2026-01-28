import { Module } from '@nestjs/common';
import { CustomerService } from './services';
import { CustomerController } from './controllers';
import { CustomerRepository } from './repositories';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService, CustomerRepository],
  exports: [CustomerService, CustomerRepository],
})
export class CustomerModule {}
