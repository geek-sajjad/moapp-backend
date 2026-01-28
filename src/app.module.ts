import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LIST_OF_MODULES } from './modules/module-names';
import { configPostgres } from './config';
import { LIST_OF_CORE_MODULES } from './core/modules/core-module-names';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { CamelCaseNamingConvention } from '@automapper/core';

@Module({
  imports: [
    ...LIST_OF_MODULES,
    ...LIST_OF_CORE_MODULES,

    ConfigModule.forRoot({ isGlobal: true }),


    ThrottlerModule.forRoot([
      {
        ttl: 60 * 1000,
        limit: 100,
      },
    ]),

    // PostgreSQL integration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configPostgres(configService), // Use the PostgreSQL factory function
    }),


    // AutoMapper integration for serlizing entities
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
      namingConventions: new CamelCaseNamingConvention(),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
