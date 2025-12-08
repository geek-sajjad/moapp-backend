import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { SeedRunner } from './seed.runner';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);
  const seedRunner = appContext.get(SeedRunner);
  await seedRunner.run();
  await appContext.close();
}

bootstrap();
