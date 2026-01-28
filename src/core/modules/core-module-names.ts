import { AuthModule } from 'src/auth/auth.module';
import { VersioningModule } from 'src/core/modules/versioning/versioning.module';
import { HealthModule } from './health/health.module';
import { ActionLogModule } from './action-log/action-log.module';
import { MappingModule } from '../mapping-profiles/mapping.module';

export const LIST_OF_CORE_MODULES = [
  HealthModule,
  AuthModule,
  VersioningModule,
  ActionLogModule,
  MappingModule,
];
