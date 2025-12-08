import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheckService,
  HealthCheck,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { CustomHealthService } from './custom-health.indicator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService, // Health check service
    private db: TypeOrmHealthIndicator, // Database health indicator
    private memory: MemoryHealthIndicator, // Memory health indicator
    private customHealthService: CustomHealthService,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    try {
      const result = await this.health.check([
        // Database health check
        () =>
          this.db.pingCheck('database').catch((error) => {
            console.error('Database health check failed:', error);
            return { database: { status: 'down', error: error.message } };
          }),
        // Memory health check (150MB heap threshold)
        () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
        () => this.customHealthService.checkCustomService(),
      ]);
      return result;
    } catch (error) {
      return error?.response;
    }
  }

  @Get('memory')
  async getMemoryUsage() {
    const memoryUsage = process.memoryUsage();
    return {
      timestamp: new Date().toISOString(),
      memory: {
        rss: {
          bytes: memoryUsage.rss,
          megabytes: (memoryUsage.rss / 1024 / 1024).toFixed(2),
          description: 'Resident Set Size - total memory allocated',
        },
        heapTotal: {
          bytes: memoryUsage.heapTotal,
          megabytes: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
          description: 'Total heap allocated',
        },
        heapUsed: {
          bytes: memoryUsage.heapUsed,
          megabytes: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
          description: 'Actual heap used',
        },
        external: {
          bytes: memoryUsage.external,
          megabytes: (memoryUsage.external / 1024 / 1024).toFixed(2),
          description: 'External memory (C++ objects)',
        },
        arrayBuffers: {
          bytes: memoryUsage.arrayBuffers,
          megabytes: (memoryUsage.arrayBuffers / 1024 / 1024).toFixed(2),
          description: 'Memory for ArrayBuffers and SharedArrayBuffers',
        },
      },
      uptime: {
        seconds: process.uptime(),
        formatted: this.formatUptime(process.uptime()),
      },
    };
  }

  private formatUptime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  }
}
