import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configPostgres } from 'src/config';
import { UserEntity } from 'src/modules/user/entities';
// import { ProviderEntity } from 'src/modules/provider/entities';
import { SeedRunner } from './seed.runner';
import { ProdSeeder } from './prod.seeder';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configPostgres(configService), // Use the PostgreSQL factory function
    }),
    TypeOrmModule.forFeature([UserEntity,]),
  ],
  providers: [ProdSeeder, SeedRunner],
  exports: [SeedRunner],
})
export class SeederModule {}
