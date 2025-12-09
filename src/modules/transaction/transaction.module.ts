import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TransactionService } from './services';
import { TransactionController } from './controllers';
import { TransactionEntity } from './entities';
import { TransactionRepository } from './repositories';
import { createRepository } from 'src/core/repositories/repository.factory';
import { ContactModule } from '../contact/contact.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    forwardRef(() => ContactModule),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    {
      provide: TransactionRepository,
      useFactory: (dataSource: DataSource) =>
        createRepository<TransactionEntity, TransactionRepository>(
          dataSource,
          TransactionRepository,
        ),
      inject: [DataSource],
    },
  ],
  exports: [TransactionService, TransactionRepository],
})
export class TransactionModule {}
