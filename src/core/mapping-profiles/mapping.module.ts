import { Module } from '@nestjs/common';
import { CommonMappingProfile } from './common.mapping-profile';

@Module({
  providers: [CommonMappingProfile],
  exports: [CommonMappingProfile],
})
export class MappingModule {}
