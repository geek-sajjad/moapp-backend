import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VersioningRepository } from './repositories';
import { VersioningService } from './versioning.service';
import { VersionEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([VersionEntity])],
  providers: [VersioningRepository, VersioningService],
  exports: [VersioningRepository, VersioningService],
})
export class VersioningModule {}
