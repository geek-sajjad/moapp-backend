import { Injectable, Logger } from '@nestjs/common';
import { ProdSeeder } from './prod.seeder';

@Injectable()
export class SeedRunner {
  private readonly logger = new Logger(SeedRunner.name);

  constructor(private readonly prodSeeder: ProdSeeder) {}

  async run() {
    try {
      this.logger.log('Starting seeding process...');

      // Run Airline Seeder
      this.logger.log('Seeding test...');
      await this.prodSeeder.seed();

      this.logger.log('Seeding completed successfully.');
    } catch (error) {
      this.logger.error('Seeding failed:', error);
    }
  }
}
