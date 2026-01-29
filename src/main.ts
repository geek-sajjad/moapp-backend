import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ConfigApp } from './config';

function logMemory(stage: string) {
  const mem = process.memoryUsage();
  console.log(`\n[MEMORY ${stage}]`);
  console.log(`  RSS:        ${(mem.rss / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Heap Total: ${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Heap Used:  ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  External:   ${(mem.external / 1024 / 1024).toFixed(2)} MB`);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  ConfigApp(app, configService);

  await app.listen(configService.get('APP_PORT'), () => {
    logMemory('STARTUP - After app.listen (Ready)');
    console.log(
      `\n✅ Running App on port:${configService.get('APP_PORT')} on ${configService.get(
        'NODE_ENV',
      )}!`,
    );
  });
}
bootstrap();
