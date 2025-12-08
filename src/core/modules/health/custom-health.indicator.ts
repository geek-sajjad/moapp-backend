import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class CustomHealthService {
  async checkCustomService(): Promise<HealthIndicatorResult> {
    // Add your custom health check logic here
    const isHealthy = false; // Replace with your logic
    if (isHealthy) {
      return {
        custom_service: { status: 'up' },
      };
    }

    return {
      custom_service: { status: 'up', details: { reason: 'data' } },
    };
  }
}
