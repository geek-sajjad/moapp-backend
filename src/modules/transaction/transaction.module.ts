import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TransactionService } from './services';
import { TransactionController } from './controllers';
import { TransactionEntity } from './entities';
import { TransactionRepository } from './repositories';
import { createRepository } from 'src/core/repositories/repository.factory';
import { CustomerModule } from '../customer/customer.module';
import { TransactionMappingProfile } from './mapping-profiles';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity]), CustomerModule],
  controllers: [TransactionController],
  providers: [
    TransactionMappingProfile,
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
