import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CmsService } from './services/cms.service';
import { Cms } from './entities/cms.entity';
import { CmsMapper } from './mappers/cms.mapper';
import { CmsRepository } from './repositories/cms.repository';
import { createRepository } from '../../core/repositories/repository.factory';
import { CmsPublicController, CmsController } from './controllers';

@Module({
  imports: [TypeOrmModule.forFeature([Cms])],
  controllers: [CmsPublicController, CmsController],
  providers: [
    CmsService,
    CmsMapper,
    {
      provide: CmsRepository,
      useFactory: (dataSource: DataSource) =>
        createRepository<Cms, CmsRepository>(dataSource, CmsRepository),
      inject: [DataSource],
    },
  ],
  exports: [CmsService],
})
export class CmsModule {}
