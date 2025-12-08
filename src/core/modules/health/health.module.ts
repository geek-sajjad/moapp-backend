import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { CustomHealthService } from './custom-health.indicator';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule],
  providers: [CustomHealthService],
  controllers: [HealthController],
})
export class HealthModule {}
