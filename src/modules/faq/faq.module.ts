import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { FaqService } from './services/faq.service';
import { FaqController } from './controllers/faq.controller';
import { Faq } from './entities/faq.entity';
import { FaqRepository } from './repositories/faq.repository';
import { createRepository } from '../../core/repositories/repository.factory';

@Module({
  imports: [TypeOrmModule.forFeature([Faq])],
  controllers: [FaqController],
  providers: [
    FaqService,
    {
      provide: FaqRepository,
      useFactory: (dataSource: DataSource) =>
        createRepository<Faq, FaqRepository>(dataSource, FaqRepository),
      inject: [DataSource],
    },
  ],
  exports: [FaqService],
})
export class FaqModule {}
