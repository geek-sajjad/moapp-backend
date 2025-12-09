import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ContactService } from './services';
import { ContactController } from './controllers';
import { ContactEntity } from './entities';
import { ContactRepository } from './repositories';
import { createRepository } from 'src/core/repositories/repository.factory';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContactEntity]),
    forwardRef(() => TransactionModule),
  ],
  controllers: [ContactController],
  providers: [
    ContactService,
    {
      provide: ContactRepository,
      useFactory: (dataSource: DataSource) =>
        createRepository<ContactEntity, ContactRepository>(
          dataSource,
          ContactRepository,
        ),
      inject: [DataSource],
    },
  ],
  exports: [ContactService, ContactRepository],
})
export class ContactModule {}
