import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createRepository } from 'src/core/repositories/repository.factory';
import { DataSource } from 'typeorm';
import { FileEntity } from './entities';
import { FileRepository } from './repositories';
import { FileService, FileValidationService } from './services';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), S3Module],
  providers: [
    FileService,
    FileValidationService,
    {
      provide: FileRepository,
      useFactory: (dataSource: DataSource) =>
        createRepository(dataSource, FileRepository),
      inject: [DataSource],
    },
  ],
  exports: [FileService, FileValidationService],
})
export class FileModule {}
